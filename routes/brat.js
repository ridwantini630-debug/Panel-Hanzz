const express = require("express");
const router = express.Router();
const apikey = require("../middleware/apikey");
const { createCanvas } = require("@napi-rs/canvas");

router.get("/", apikey, async (req, res) => {
  try {
    const text = req.query.text;

    if (!text) {
      return res.json({
        status: false,
        message: "Masukkan text"
      });
    }

    const canvas = createCanvas(700, 500);
    const ctx = canvas.getContext("2d");

    // Background putih
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, 700, 500);

    // Teks hitam
    ctx.fillStyle = "#000000";
    ctx.font = "60px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(text, 350, 250);

    const buffer = canvas.toBuffer("image/png");

    res.setHeader("Content-Type", "image/png");
    res.end(buffer);

  } catch (err) {
    res.status(500).json({
      status: false,
      message: err.message
    });
  }
});

module.exports = router;
