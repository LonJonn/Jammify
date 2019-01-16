const ytdl = require("youtube-dl");
const express = require("express");
const router = express.Router();

router.post("/check", async (req, res) => {
  const result = await checkLink(req.body.link);
  res.send(result);
});

function checkLink(url) {
  return new Promise(resolve => {
    ytdl.getInfo(url, error => {
      if (error) resolve(false);
      resolve(true);
    });
  });
}

module.exports = router;
