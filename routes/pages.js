import express from 'express';

const router = express.Router();

router.get("/", (req, res) => {
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
