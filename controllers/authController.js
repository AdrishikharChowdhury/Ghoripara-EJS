const dbgr = require("debug")("development:authController");
const userModel = require("../models/user-model");
const bcrypt = require("bcrypt");
const { generateToken } = require("../utils/generateToken");

module.exports.registerUser = async (req, res) => {
  try {
    const { name, email, password, contact } = req.body;
    let existingUser = await userModel.findOne({ email });
    if (existingUser) {
      req.flash("error", "User already exists");
      return res.redirect("/register");
    }
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    let user = await userModel.create({
      name,
      email,
      password: hash,
      contact,
    });
    let token = generateToken(user);
    res.cookie("token", token);
    dbgr(user);
    dbgr(token);
    req.flash("success", "Registration successful");
    return res.redirect("/user/dashboard");
  } catch (error) {
    dbgr(error.message);
    req.flash("error", "Registration failed");
    return res.redirect("/register");
  }
};

module.exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    let user = await userModel.findOne({ email });
    if (!user){ 
      req.flash("error", "Invalid email or password");
      return res.redirect("/login");
    }
    const result = await bcrypt.compare(password, user.password);
    if (!result) {
      req.flash("error", "Invalid email or password");
      return res.redirect("/login");
    }

    const token = generateToken(user);

    res.cookie("token", token);

    dbgr(user);
    dbgr(token);

    req.flash("success", `Welcome back, ${user.name}`);
    return res.redirect("/user/dashboard");
  } catch (error) {
    dbgr(error.message);
    req.flash("error", "Something went wrong");
    return res.redirect("/login");
  }
};

module.exports.logoutUser=(req, res) => {
  res.clearCookie("token");
  return res.redirect("/");
}