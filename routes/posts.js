const router = require("express").Router();
const verifyToken = require("./verifyToken");

router.get("/", verifyToken, (req, res) => {
  res.send("You may enter...");
});

module.exports = router;
