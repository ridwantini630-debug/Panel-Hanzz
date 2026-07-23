const express = require("express");
const apikey = require("../middleware/apikey");
const router = express.Router();
const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");
router.get("/", apikey, async (req, res) => {
  try {
    const text = req.query.text;

    if (!text) {
      return res.json({
        status: false,
        message: "Masukkan text"
      });
    }

    const temp = path.join(__dirname, "../database/temp");

    if (!fs.existsSync(temp)) {
      fs.mkdirSync(temp, { recursive: true });
    }

    const id = Date.now();
    const frameDir = path.join(temp, id.toString());

    fs.mkdirSync(frameDir);

    const words = text.split(" ");

    let index = 0;

    for (let i = 0; i < words.length; i++) {
      const current = words.slice(0, i + 1).join(" ");
     console.time("fetch");

const apikeyUser = req.query.apikey;

const response = await fetch(
  "http://localhost:3000/brat?text=" + encodeURIComponent(current) + "&apikey=" + apikeyUser
);
console.log("STATUS:", response.status);

const type = response.headers.get("content-type");
console.log("TYPE:", type);

if (!type || !type.includes("image")) {
  const err = await response.text();
  throw new Error("API brat gagal: " + err);
}

const buffer = Buffer.from(await response.arrayBuffer());
 console.timeEnd("fetch");
      console.log("SIZE:", buffer.length);
      for (let x = 0; x < 10; x++) {
        fs.writeFileSync(
          path.join(frameDir, `${index}.png`),
          buffer
        );
        index++;
      }
    }
    console.log("TOTAL FRAME:", index);
    const output = path.join(temp, `${id}.mp4`);
    const fileListPath = path.join(temp, `${id}.txt`);
let fileListContent = "";

for (let i = 0; i < index; i++) {
  fileListContent += `file '${path.join(frameDir, `${i}.png`)}'\n`;
  fileListContent += "duration 10\n";
}

fileListContent += `file '${path.join(frameDir, `${index - 1}.png`)}'\n`;
fileListContent += "duration 10\n";

fs.writeFileSync(fileListPath, fileListContent);
console.log("=== fileList ===");
console.log(fs.readFileSync(fileListPath, "utf8"));
 execSync(
 `ffmpeg -y -f concat -safe 0 -i "${fileListPath}" -r 30 -c:v libx264 -preset veryfast -pix_fmt yuv420p "${output}"`
);
console.timeEnd("ffmpeg");
res.sendFile(output, () => {
  if (fs.existsSync(fileListPath)) fs.unlinkSync(fileListPath);
  if (fs.existsSync(output)) fs.unlinkSync(output);
  if (fs.existsSync(frameDir)) {
    fs.rmSync(frameDir, { recursive: true, force: true });
  }
});

  } catch (e) {
    res.json({
      status: false,
      message: e.message
    });
  }
});

module.exports = router;
