const express = require("express");
const router = express.Router();
const dbgr = require("debug")("development: user");
const { isLoggedIn } = require("../middlewares/loginVerify");
const { generateToken } = require("../utils/generateToken");
const userModel = require("../models/user-model");
const productModel = require("../models/product-model");

router.get("/dashboard", isLoggedIn, async (req, res) => {
  try {
    let error = req.flash("error");
    let success = req.flash("success");
    let { email } = req.user;
    let user = await userModel.findOne({ email });
    await user.populate("cart");
    await user.populate("orders")
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

module.exports = router;
