const express = require("express");
const bcrypt = require("bcrypt");
const ownerModel = require("../models/owner-model");
const productModel = require("../models/product-model");
const { generateAdminToken } = require("../utils/generateAdminToken");
const { isLoggedIn } = require("../middlewares/loginVerify");
const { isAdmin } = require("../middlewares/adminVerify");
const router = express.Router();
const dbgr = require("debug")("development:ownerRouter");

if (process.env.NODE_ENV === "development") {
  router.get("/login", (req, res) => {
    let success = req.flash("success");
    let error = req.flash("error");
    res.render("ownerlogin", { success, error });
  });

  router.get("/register", (req, res) => {
    let success = req.flash("success");
    let error = req.flash("error");
    res.render("ownerregister", { success, error });
  });

  router.post("/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      let owner = await ownerModel.findOne({ email });
      if (!owner) {
        req.flash("error", "Invalid email or password");
        return res.redirect("/owners/login");
      }
      const result = await bcrypt.compare(password, owner.password);
      if (!result) {
        req.flash("error", "Invalid email or password");
        return res.redirect("/login");
      }
      let token = generateAdminToken(owner);
      res.cookie("token", token);
      req.flash("success", "Registration successful");
      return res.redirect("/owners/all");
    } catch (error) {
      dbgr(error.message);
      req.flash("error", "Something went wrong");
      return res.redirect("/owners/login");
    }
  });

  router.post("/create", async (req, res) => {
    try {
      let owners = await ownerModel.find();
      if (owners.length > 0) {
        req.flash("error", "Only One Admin at a time");
        return res.redirect("/");
      }

      const { name, email, password } = req.body;
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(password, salt);

      let owner = await ownerModel.create({
        name,
        email,
        password: hash,
      });
      let token = generateAdminToken(owner);
      res.cookie("token", token);
      req.flash("success", "Registration successful");
      return res.redirect("/owners/all");
    } catch (error) {
      dbgr(error.message);
      return res.redirect("/logout");
    }
  });
}

router.get("/generate", isLoggedIn, isAdmin, (req, res) => {
  let success = req.flash("success");
  let error = req.flash("error");
  res.render("createproducts", { success, error });
});

router.get("/all", isLoggedIn, isAdmin, async (req, res) => {
  let success = req.flash("success");
  let error = req.flash("error");
  const products = await productModel.find();
  res.render("allproducts", { success, error, products });
});

module.exports = router;
