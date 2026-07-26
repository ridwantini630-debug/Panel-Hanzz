const express = require("express");
const router = express.Router();
const isLogin = require("../middleware/auth");
const generateKey = require("../lib/apikey");
const fs = require("fs");
const path = require("path");
const brat = require("./brat");
const bratvid = require("./bratvid");
const apikey = require("../middleware/apikey");
const file = path.join(__dirname, "../database/apikey.json");
router.get("/api", isLogin, (req, res) => {
const keys = JSON.parse(fs.readFileSync(file));

    const userKey = keys.filter(
        (item) => item.user === req.session.user
    );
    res.render("api", {
        title: "API Hanzz Panel",
        keys: userKey
    });
});
router.get("/create-api", isLogin, (req, res) => {
    const keys = JSON.parse(fs.readFileSync(file));

    const role = req.query.role || "member";
    const newKey = {
        user: req.session.user,
        key: generateKey(),
        role: role,
        limit: role === "premium" ? 10000 : 100
    };

    keys.push(newKey);

    fs.writeFileSync(file, JSON.stringify(keys, null, 2));

    res.redirect("/api");
});
router.get("/ping", apikey, (req, res) => {
    res.json({
        status: true,
        creator: "Hanzz",
        message: "API aktif"
    });
});
router.get("/delete-api", isLogin, (req, res) => {
  const key = req.query.key;
const keys = JSON.parse(fs.readFileSync(file));
const target = keys.find((item) => item.key === key);
if (target && target.role === "admin") {
    return res.json({
        status: false,
        message: "API Key admin tidak boleh dihapus"
    });
}
const filter = keys.filter((item) => item.key !== key);
fs.writeFileSync(
    file,
    JSON.stringify(filter, null, 2)
);
res.redirect("/api");
});
router.get("/add-limit", isLogin, (req, res) => {
  const key = req.query.key;
  const keys = JSON.parse(fs.readFileSync(file));
  const target = keys.find((item) => item.key === key);
if (!target) {
    return res.json({
        status: false,
        message: "API Key tidak ditemukan"
    });
}
const amount = Number(req.query.amount || 100);
if (target.role === "admin") {
    return res.json({
        status: false,
        message: "Limit admin tidak bisa ditambah"
    });
}
target.limit += amount;
fs.writeFileSync(
    file,
    JSON.stringify(keys, null, 2)
);
res.redirect("/api");
});
router.get("/upgrade-role", isLogin, (req, res) => {
  const key = req.query.key;
  const keys = JSON.parse(fs.readFileSync(file));
  const target = keys.find((item) => item.key === key);
if (!target) {
    return res.json({
        status: false,
        message: "API Key tidak ditemukan"
    });
}
target.role = "premium";
target.limit = 10000;
fs.writeFileSync(
    file,
    JSON.stringify(keys, null, 2)
);
res.redirect("/api");
});
router.use("/brat", brat);
router.use("/bratvid", bratvid);
module.exports = router;
