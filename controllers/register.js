import bcrypt from 'bcrypt';
// import jwt from 'jsonwebtoken';
import db from '../config/db.js';
import { generateToken } from '../controllers/generateToken.js';
import { generateResetToken } from "../utils/token.js";
//generate token
//I created a module I will import
// const generateToken = (user) => {
//     return jwt.sign(
//         { id: user.id, username: user.username, email: user.email },
//         process.env.JWT_SECRET,
//         { expiresIn: process.env.JWT_EXPIRES_IN || 'id' }
//     );
// };

const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 24 * 60 * 60 * 1000, // 1 day
};

export const register = async (req, res) => {
    const { Fname, Lname, email, password, user_name } = req.body;

    const missing = [];
    if (Fname === undefined || Fname === null || Fname === "") missing.push("Fname");
    if (Lname === undefined || Lname === null || Lname === "") missing.push("Lname");
    if (email === undefined || email === null || email === "") missing.push("email");
    if (password === undefined || password === null || password === "") missing.push("password");
    if (user_name === undefined || user_name === null || user_name === "") missing.push("user_name");

    if (missing.length > 0) {
        return res.status(400).json({
            success: false,
            message: "Missing filed are required",
            fields: missing
        });
    }

    if (password.length < 6) {
        return res.status(400).json({ message: 'Passowrd length must be at least 6 charcaters' });
    }
    try {
        db.query(
            'SELECT user_name FROM users WHERE user_name = ?',
            [user_name],

            async (err, results) => {
                if (err) {
                    console.error(err);
                    return res.status(500).json({ message: 'Database Error' });
                }

                if (results.length > 0) {
                    return res.status(409).json({ mesage: 'User already exists' });
                }

                const hashedPassword = await bcrypt.hash(password, 10);
                const { tokenHash } = generateResetToken();

                //insert usert
                db.query(
                    'INSERT INTO users (Fname, Lname, email, password, user_name, token_hash) VALUES (?, ?, ?, ?, ?, ?)',
                    [Fname, Lname, email, hashedPassword, user_name, tokenHash],
                    (err, result) => {
                        if (err) {
                            console.error(err);
                            return res.status(500).json({
                                success: false,
                                mesage: 'Error creating the user'
                            });
                        }

                        const user = { id: result.insertId, user_name, email };
                        const token = generateToken(user);

                        res.cookie('token', token, cookieOptions);
                        return res.status(201).json({
                            message: "User registered successfully",
                            user,
                            token,
                        });
                    }
                );
            }
        )
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};