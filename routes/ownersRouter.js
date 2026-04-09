const express = require("express");
const bcrypt = require("bcrypt");
const ownerModel = require("../models/owner-model");
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

router.get("/", (req, res) => {
  res.render("ownerLogin");
});

module.exports = router;
