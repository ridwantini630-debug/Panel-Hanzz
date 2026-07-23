const express = require("express");
const router = express.Router();
const brat = require("./brat");
const bratvid = require("./bratvid");
const apikey = require("../middleware/apikey");

router.get("/", (req, res) => {
    res.json({
        status: true,
        creator: "Hanzz",
        message: "Selamat datang di API Hanzz"
    });
});

router.get("/ping", apikey, (req, res) => {
    res.json({
        status: true,
        creator: "Hanzz",
        message: "API aktif"
    });
});
router.use("/brat", brat);
router.use("/bratvid", bratvid);
module.exports = router;
