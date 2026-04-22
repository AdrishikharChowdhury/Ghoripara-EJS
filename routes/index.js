const express = require("express");
const router = express.Router();
const { registerUser } = require("../controllers/authController");
const userModel = require("../models/user-model");
const dbgr = require("debug")("development: dashboard");
const { isLoggedIn } = require("../middlewares/loginVerify");
const { generateToken }=require("../utils/generateToken")
const bcrypt=require("bcrypt")

router.get("/", (req, res) => {
  res.render("index");
});

router.get("/register", (req, res) => {
  res.render("register");
});

router.get("/login", (req, res) => {
  res.render("login");
});

router.get("/dashboard", isLoggedIn, async (req, res) => {
  try {
    let { email } = req.user;
    let user = await userModel.findOne({ email });

    dbgr(user);

    if (!user) {
      return res.status(404).send("User not Found");
    }

    res.render("dashboard", { user });
  } catch (error) {
    dbgr(error);
    return res.status(500).send("Something Went Wrong");
  }
});

router.get("/logout", isLoggedIn, (req, res) => {
  res.clearCookie("token");
  return res.redirect("/");
});

router.post("/create", registerUser);

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    let user = await userModel.findOne({ email });
    if (!user) return res.status(500).send("Something Went Wrong");
    bcrypt.compare(password, user.password, (err, result) => {
      if (result) {
        let token = generateToken(user)
        res.cookie("token", token);
        dbgr(user);
        dbgr(token);
        return res.status(200).redirect("/dashboard");
      }
      res.redirect("/login");
    });
  } catch (error) {
    dbgr(error)
    return res.status(500).send("Something Went Wrong")
  }
});

module.exports = router;
