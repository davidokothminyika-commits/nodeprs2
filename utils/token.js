import crypto from "crypto";

export const hashResetToken = (token) => crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");

export const generateResetToken = () => {
    const token = crypto.randomBytes(32).toString("hex");
    return { token, tokenHash: hashResetToken(token) };
};