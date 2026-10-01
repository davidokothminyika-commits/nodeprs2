import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get("/", authMiddleware, (req, res) => {
    res.sendFile('dashboard.html', { root: "./public" });
});

router.get("/login", (req, res) => {
    res.sendFile('login.html', { root: "./public" });
});

router.get("/register", (req, res) => {
    res.sendFile("register.html", { root: "./public" });
});

router.get("/reset-password", (req, res) => {
    res.sendFile("reset-password.html", { root: "./public" });
});

export default router;
