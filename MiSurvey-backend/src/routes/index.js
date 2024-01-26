var express = require("express");
var router = express.Router();

router.get("/", (req, res) => {
  if (req.isAuthenticated()) {
    res.redirect("/dashboard");
  } else {
    res.redirect("/admin/login");
  }
});

module.exports = router;
