const dbgr = require("debug")("development:authController");
const userModel = require("../models/user-model");
const bcrypt = require("bcrypt");
const { generateToken } = require("../utils/generateToken");

module.exports.registerUser = async (req, res) => {
  try {
    const { name, email, password, contact } = req.body;
    let existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(400).send("User already exists");
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
    return res.render("/dashboard");
  } catch (error) {
    dbgr(error.message);
  }
};
