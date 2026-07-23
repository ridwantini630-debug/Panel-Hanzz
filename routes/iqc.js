const express = require("express");
const { createCanvas, loadImage } = require("@napi-rs/canvas");

const router = express.Router();

function wrapText(ctx, text, maxWidth) {
  const words = text.split(/\s+/);
  const lines = [];
  let line = "";

  for (const word of words) {
    const test = line ? line + " " + word : word;
    if (ctx.measureText(test).width > maxWidth && line) {
      lines.push(line);
      line = word;
    } else {
      line = test;
    }
  }

  if (line) lines.push(line);
  return lines;
}

router.get("/iqc", async (req, res) => {
  try {
    const name = (req.query.name || "Hanzz").substring(0, 40);
    const text = req.query.text || "Halo dunia";
    const pp = req.query.pp || "";

    const canvas = createCanvas(720, 1280);
    const ctx = canvas.getContext("2d");
    // Background
    ctx.fillStyle = "#efe7dd";
    ctx.fillRect(0, 0, 720, 1280);

    // Header WhatsApp
    ctx.fillStyle = "#075E54";
    ctx.fillRect(0, 0, 720, 90);

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 34px sans-serif";
    ctx.fillText("WhatsApp", 90, 58);

    // Foto profil (jika ada URL)
    if (pp) {
      try {
        const avatar = await loadImage(pp);
        ctx.save();
        ctx.beginPath();
        ctx.arc(45, 45, 25, 0, Math.PI * 2);
        ctx.clip();
        ctx.drawImage(avatar, 20, 20, 50, 50);
        ctx.restore();
      } catch (e) {}
    }

    // Bubble chat
    const bubbleX = 90;
    const bubbleY = 180;
    const bubbleW = 560;

    ctx.font = "28px sans-serif";
    const lines = wrapText(ctx, text, bubbleW - 40);
    const bubbleH = 95 + (lines.length * 36);

    ctx.fillStyle = "#DCF8C6";
    ctx.beginPath();
    ctx.roundRect(bubbleX, bubbleY, bubbleW, bubbleH, 18);
    ctx.fill();

    // Nama pengirim
    ctx.fillStyle = "#128C7E";
    ctx.font = "bold 24px sans-serif";
    ctx.fillText(name, bubbleX + 20, bubbleY + 35);
    // Isi pesan
    ctx.fillStyle = "#000000";
    ctx.font = "28px sans-serif";

    let y = bubbleY + 75;

    for (const line of lines) {
      ctx.fillText(line, bubbleX + 20, y);
      y += 36;
    }

    // Jam
    const time = new Date().toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit"
    });

    ctx.fillStyle = "#667781";
    ctx.font = "20px sans-serif";
    ctx.fillText(time, bubbleX + bubbleW - 95, bubbleY + bubbleH - 15);

    // Centang biru
    ctx.fillStyle = "#53BDEB";
    ctx.font = "22px sans-serif";
    ctx.fillText("✓✓", bubbleX + bubbleW - 40, bubbleY + bubbleH - 15);

    res.setHeader("Content-Type", "image/png");
    res.end(canvas.toBuffer("image/png"));

  } catch (err) {
    res.status(500).json({
      status: false,
      error: err.message
    });
  }
});

module.exports = router;
