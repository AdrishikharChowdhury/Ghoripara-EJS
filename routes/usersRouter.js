const express = require("express");
const router = express.Router();
const dbgr = require("debug")("development: user");
const { isLoggedIn } = require("../middlewares/loginVerify");
const { generateToken } = require("../utils/generateToken");
const userModel = require("../models/user-model");
const productModel = require("../models/product-model");
const upload = require("../config/multer-config");

router.get("/dashboard", isLoggedIn, async (req, res) => {
  try {
    let error = req.flash("error");
    let success = req.flash("success");
    let { email } = req.user;
    let user = await userModel.findOne({ email });
    await user.populate("cart");
    await user.populate("orders");
    dbgr(user);

    if (!user) {
      req.flash("error", "User not found. Please login again.");
      return res.redirect("/login");
    }

    res.render("dashboard", { user, error, success });
  } catch (error) {
    dbgr(error);
    req.flash("error", "Something went wrong. Please try again.");
    res.redirect("/login");
  }
});

router.get("/delete/:id", isLoggedIn, async (req, res) => {
  try {
    const { id } = req.params;
    const { email } = req.user;
    let user = await userModel.findOne({ email });
    if (!user) {
      dbgr("User Not Found");
      req.flash("error", "User Not Found");
      return res.redirect("/user/dashboard");
    }
    user.cart.pull(id);
    await user.save();
    return res.redirect("/user/dashboard");
  } catch (error) {
    dbgr(error.message);
  }
});

router.get("/order/delete/:id", isLoggedIn, async (req, res) => {
  try {
    const { id } = req.params;
    const { email } = req.user;
    let user = await userModel.findOne({ email });
    if (!user) {
      dbgr("User Not Found");
      req.flash("error", "User Not Found");
      return res.redirect("/user/dashboard");
    }
    user.orders.pull(id);
    await user.save();
    return res.redirect("/user/dashboard");
  } catch (error) {
    dbgr(error.message);
  }
});

router.get("/settings", isLoggedIn, async (req, res) => {
  try {
    const { email } = req.user;
    let user = await userModel.findOne({ email });
    if (!user) {
      dbgr("User Not Found");
      req.flash("error", "User Not Found");
      return res.redirect("/logout");
    }
    res.render("settings", { user });
  } catch (error) {
    dbgr(error.message);
  }
});

router.post("/edit", upload.single("image"), isLoggedIn, async (req, res) => {
  try {
    const { id } = req.user;
    const { name, email, password, contact } = req.body;
    let prevUser = await userModel.findOne({ _id: id });
    if (!prevUser) {
      dbgr("User Not Found");
      req.flash("error", "User Not Found");
      return res.redirect("/logout");
    }
    let updatedPassword = prevUser.password;
    if (password && password.trim() !== "") {
      const salt = await bcrypt.genSalt(10);
      updatedPassword = await bcrypt.hash(password, salt);
    }
    let updateData = {
      name: name || prevUser.name,
      email: email || prevUser.email,
      contact: contact || prevUser.contact,
      password: updatedPassword,
      pfp: prevUser.pfp,
    };

    if (req.file) {
      updateData.pfp = {
        buffer: req.file.buffer,
        mimetype: req.file.mimetype,
      };
    }

    let editedUser = await userModel.findOneAndUpdate({ _id: id }, updateData, {
      new: true,
    });
    req.flash("success", "User Updated and Saved");
    return res.redirect("/user/dashboard");
  } catch (error) {
    dbgr(error.message);
    return res.redirect("/logout");
  }
});

module.exports = router;
