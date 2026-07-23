const express = require("express");
const router = express.Router();

// Akun admin sementara
const ADMIN = {
    username: "admin",
    password: "12345"
};

// Halaman login
router.get("/login", (req, res) => {
    res.render("login");
});

// Proses login
router.post("/login", (req, res) => {
    const { username, password } = req.body;

    if (
        username === ADMIN.username &&
        password === ADMIN.password
    ) {
        req.session.user = username;
        return res.redirect("/");
    }

    res.send("Username atau password salah!");
});
router.get("/logout", (req, res) => {
    req.session.destroy(() => {
        res.redirect("/login");
    });
});
module.exports = router;
