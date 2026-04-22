const express = require("express");
const router = express.Router();
const { registerUser, loginUser, logoutUser } = require("../controllers/authController");
const userModel = require("../models/user-model");
const dbgr = require("debug")("development: dashboard");
const { isLoggedIn } = require("../middlewares/loginVerify");
const { generateToken } = require("../utils/generateToken");
const bcrypt = require("bcrypt");

router.get("/", (req, res) => {
  res.render("index");
});

router.get("/register", (req, res) => {
  let error = req.flash("error");
  let success = req.flash("success");
  res.render("register", { error, success });
});

router.get("/login", (req, res) => {
  let error = req.flash("error");
  let success = req.flash("success");
  res.render("login", { error, success });
});

router.get("/explore", isLoggedIn, async (req, res) => {
  try {
    let error = req.flash("error");
    let success = req.flash("success");
    const { email } = req.user;
    const user = await userModel.findOne({ email });

    if (!user) {
      req.flash("error", "User not found. Please login again.");
      return res.redirect("/login");
    }

    res.render("explore", { user,error,success });
  } catch (error) {
    dbgr("Explore error:", error);
    req.flash("error", "Something went wrong. Please try again.");
    res.redirect("/login");
  }
});

router.post("/create", registerUser);

router.post("/login", loginUser);

router.get("/logout", isLoggedIn, logoutUser);

module.exports = router;
