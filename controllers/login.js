import bcrypt from "bcrypt";
import db from "../config/db.js";

import * as generateToken from "./generateToken.js";

export const login = async (req, res) => {
    const { user_name, password } = req.body;

    const missing = [];

    if (user_name === "" || user_name === "null" || user_name === null) missing.push("user_name");
    if (password === "" || password === "null" || password === null) missing.push("password");

    if (missing.length > 0) {
        return res.status(400).json({
            success: false,
            message: "All fields are required",
            fields: missing
        })
    }

    try {
        db.query(
            "SELECT user_name, id, password, email FROM users WHERE user_name = ?",
            [user_name],

            async (err, results) => {

                if (err) {
                    console.err(err);
                    return res.status(500).json({
                        message: "Database error"
                    })
                }

                if (results.length === 0) {
                    return res.status(400).json({
                        success: false,
                        message: "Invalid Credentials"
                    })
                }

                const user = results[0];
                //Check password

                const checkPassword = await bcrypt.compare(password, user.password);

                if (!checkPassword) {
                    return res.status(401).json({
                        message: "Invalid Credentials"
                    })
                }

                const token = generateToken.generateToken(user);

                res.cookie("token", token, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === "production",
                    sameSite: "lax",
                    maxAge: 24 * 60 * 60 * 1000
                });

                return res.status(200).json({
                    success: true,
                    message: "Login Successful"
                });
            }

        )
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Internal Sever Error"
        });
    }
}