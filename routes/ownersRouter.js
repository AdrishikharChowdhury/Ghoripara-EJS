const express = require("express");
const bcrypt = require("bcrypt");
const ownerModel = require("../models/owner-model");
const productModel = require("../models/product-model");
const router = express.Router();

if (process.env.NODE_ENV === "development") {
  router.post("/create", async (req, res) => {
    let owners = await ownerModel.find();
    if (owners.length > 0)
      return res
        .status(503)
        .send("you dont have permission to create an owner");

    const { name, email, password } = req.body;

    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(password, salt, async (err, hash) => {
        let createdOwner = await ownerModel.create({
          name,
          email,
          password: hash,
        });
      });
    });
  });
}

router.get("/generate", (req, res) => {
  let success = req.flash("success");
  let error = req.flash("error");
  res.render("createproducts", { success, error });
});

router.get("/all", async (req, res) => {
  let success = req.flash("success");
  let error = req.flash("error");
  const products = await productModel.find();
  res.render("allproducts", { success, error, products });
});

module.exports = router;
