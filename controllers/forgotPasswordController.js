import bcrypt from "bcrypt";
import db from "../config/db.js";
import { fakeMailer } from "../utils/fakeMailer.js";
import { generateResetToken, hashResetToken } from "../utils/token.js";

const query = (sql, values = []) => new Promise((resolve, reject) => {
    db.query(sql, values, (error, results) => {
        if (error) reject(error);
        else resolve(results);
    });
});

const genericResponse = "If an account exists for that email, a reset link has been sent.";

export const forgotPassword = async (req, res) => {
    const email = typeof req.body?.email === "string" ? req.body.email.trim() : "";
    if (!email) {
        return res.status(400).json({ success: false, message: "Email is required." });
    }

    try {
        const users = await query("SELECT id, email FROM users WHERE email = ? LIMIT 1", [email]);
        if (users.length === 0) return res.status(200).json({ message: genericResponse });

        const { token, tokenHash } = generateResetToken();
        const expiresAt = new Date(Date.now() + 15 * 60 * 1000);
        await query(
            "INSERT INTO password_reset_tokens (user_id, token_hash, expires_at) VALUES (?, ?, ?)",
            [users[0].id, tokenHash, expiresAt]
        );

        const baseUrl = process.env.APP_BASE_URL || "http://localhost:3000";
        const resetUrl = `${baseUrl.replace(/\/$/, "")}/reset-password?token=${token}`;
        await fakeMailer.sendMail({
            from: "no-reply@myapp.local",
            to: users[0].email,
            subject: "Password Reset",
            text: `Reset your password using this link: ${resetUrl}. The link expires in 15 minutes.`,
            html: `<p>Reset your password using the link below. It expires in 15 minu tes.</p><p><a href="${resetUrl}">Reset password</a></p>`
        });

        return res.status(200).json({ message: genericResponse });
    } catch (error) {
        console.error("Forgot password failed:", error);
        return res.status(500).json({ success: false, message: "Unable to process the request." });
    }
};

export const resetPassword = async (req, res) => {
    const { token, password } = req.body ?? {};
    if (typeof token !== "string" || !/^[a-f0-9]{64}$/i.test(token)) {
        return res.status(400).json({ success: false, message: "Reset token is invalid or expired." });
    }
    if (typeof password !== "string" || password.length < 8) {
        return res.status(400).json({ success: false, message: "Password must be at least 8 characters." });
    }

    try {
        const tokenHash = hashResetToken(token);
        const rows = await query(
            "SELECT user_id FROM password_reset_tokens WHERE token_hash = ? AND expires_at > NOW() LIMIT 1",
            [tokenHash]
        );
        if (rows.length === 0) {
            return res.status(400).json({ success: false, message: "Reset token is invalid or expired." });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const result = await query("UPDATE users SET password = ? WHERE id = ?", [hashedPassword, rows[0].user_id]);
        if (result.affectedRows !== 1) {
            return res.status(400).json({ success: false, message: "Unable to reset password for this account." });
        }

        await query("DELETE FROM password_reset_tokens WHERE token_hash = ?", [tokenHash]);
        return res.status(200).json({ success: true, message: "Password reset successfully." });
    } catch (error) {
        console.error("Password reset failed:", error);
        return res.status(500).json({ success: false, message: "Unable to reset the password." });
    }
};