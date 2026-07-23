const express = require("express");
const router = express.Router();
const { exec } = require("child_process");
const apikey = require("../middleware/apikey");
router.get("/", apikey, async (req, res) => {
  const text = req.query.text;

  if (!text) {
    return res.json({
      status: false,
      message: "Masukkan text"
    });
  }

  const safeText = text.replace(/[^a-zA-Z0-9 .,!?-]/g, "");

  const output = "./public/brat.png";

  const cmd = `magick -size 700x500 xc:white \
-fill black -pointsize 60 \
-gravity center \
-draw "text 0,0 '${safeText}'" \
${output}`;

  exec(cmd, (err) => {
    if (err) {
      return res.json({
        status: false,
        message: err.message
      });
    }

    res.sendFile(require("path").resolve(output));
  });
});

module.exports = router;
