import bcrypt from "bcrypt";
import assert from "node:assert/strict";
import { afterEach, test } from "node:test";
import db from "../config/db.js";
import { forgotPassword, resetPassword } from "../controllers/forgotPasswordController.js";
import { fakeOutbox } from "../utils/fakeMailer.js";
import { generateResetToken, hashResetToken } from "../utils/token.js";

const originalQuery = db.query;

const makeResponse = () => ({
    statusCode: 200,
    body: undefined,
    status(code) {
        this.statusCode = code;
        return this;
    },
    json(body) {
        this.body = body;
        return this;
    }
});

afterEach(() => {
    db.query = originalQuery;
    fakeOutbox.length = 0;
});

test("reset token generation returns a raw token and matching SHA-256 hash", () => {
    const { token, tokenHash } = generateResetToken();
    assert.equal(token.length, 64);
    assert.equal(tokenHash, hashResetToken(token));
    assert.equal(tokenHash.length, 64);
});

test("fake-mail reset flow stores only a hash and changes the password once", async () => {
    const stored = { user: { id: 7, email: "person@example.test" }, reset: null, password: null };
    db.query = (sql, values, callback) => {
        if (sql.startsWith("SELECT id, email FROM users")) {
            return callback(null, [stored.user]);
        }
        if (sql.startsWith("INSERT INTO password_reset_tokens")) {
            stored.reset = { userId: values[0], tokenHash: values[1], expiresAt: values[2] };
            return callback(null, { insertId: 1 });
        }
        if (sql.startsWith("SELECT user_id FROM password_reset_tokens")) {
            return callback(null, stored.reset?.tokenHash === values[0] && stored.reset.expiresAt > new Date()
                ? [{ user_id: stored.reset.userId }]
                : []);
        }
        if (sql.startsWith("UPDATE users SET password")) {
            stored.password = values[0];
            return callback(null, { affectedRows: 1 });
        }
        if (sql.startsWith("DELETE FROM password_reset_tokens")) {
            stored.reset = null;
            return callback(null, { affectedRows: 1 });
        }
        throw new Error(`Unexpected SQL: ${sql}`);
    };

    const requestResponse = makeResponse();
    await forgotPassword({ body: { email: stored.user.email } }, requestResponse);
    assert.equal(requestResponse.statusCode, 200);
    assert.equal(fakeOutbox.length, 1);
    const token = fakeOutbox[0].text.match(/token=([a-f0-9]{64})/)[1];
    assert.equal(stored.reset.tokenHash, hashResetToken(token));

    const resetResponse = makeResponse();
    await resetPassword({ body: { token, password: "changed-pass-123" } }, resetResponse);
    assert.equal(resetResponse.statusCode, 200);
    assert.equal(await bcrypt.compare("changed-pass-123", stored.password), true);
    assert.equal(stored.reset, null);

    const replayResponse = makeResponse();
    await resetPassword({ body: { token, password: "another-pass-123" } }, replayResponse);
    assert.equal(replayResponse.statusCode, 400);
});