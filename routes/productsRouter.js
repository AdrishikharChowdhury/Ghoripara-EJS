const express = require("express");
const dbgr = require("debug")("development: products");
const router = express.Router();
const upload = require("../config/multer-config");
const productModel = require("../models/product-model");
const userModel = require("../models/user-model");
const { isLoggedIn } = require("../middlewares/loginVerify");

router.post(
  "/generateproduct",
  upload.single("image"),
  isLoggedIn,
  async (req, res) => {
    try {
      const { name, details, price, discount } = req.body;
      const { buffer, mimetype } = req.file;
      const product = await productModel.create({
        image: {
          buffer,
          mimetype,
        },
        name,
        details,
        price,
        discount,
      });
      if (!product) {
        req.flash("error", "Product Not Generated");
        return res.redirect("/createproducts");
      }
      req.flash("success", "Product Created Successfully");
      return res.redirect("/owners/all");
    } catch (error) {
      dbgr(error.message);
      return res.redirect("/createproducts");
    }
  },
);

router.get("/:id", isLoggedIn, async (req, res) => {
  try {
    let error = req.flash("error");
    let success = req.flash("success");
    const { email } = req.user;
    const { id } = req.params;
    let user = await userModel.findOne({ email });
    let product = await productModel.findOne({ _id: id });
    if (!product) {
      dbgr("Product Not Found");
      return res.redirect("/owners/all");
    }
    res.render("product", { product, user, error, success });
  } catch (error) {
    dbgr(error.message);
    return res.redirect("/owners/all");
  }
});

router.get("/cart/:id", isLoggedIn, async (req, res) => {
  try {
    const { id } = req.params;
    const { email } = req.user;
    let user = await userModel.findOne({ email });
    if (!user) {
      req.flash("error", "User Not Found");
      dbgr("User Not Found");
      return res.redirect(req.get("Referrer") || "/");
    }
    let product = await productModel.findOne({ _id: id });
    if (!product) {
      req.flash("error", "Product Not Found");
      dbgr("Product Not Found");
      return res.redirect(req.get("Referrer") || "/");
    }
    user.cart.push(product._id);
    await user.save()
    req.flash("success", "Product Added To The Cart");
    return res.redirect("/user/dashboard");
  } catch (error) {
    dbgr(error.message);
  }
});

router.get("/order/:id",isLoggedIn,async (req,res) => {
  try {
    const {id}=req.params
    const {email}=req.user
    let user=await userModel.findOne({email})
    if(!user){
      dbgr("User Not Found")
      req.flash("error","User Not Found")
      return res.redirect(`/products/${id}`)
    }
    let product=await productModel.findOne({_id:id})
    if(!product){
      dbgr("Product Not Found")
      req.flash("error","Product Not Found")
      return res.redirect(`/products/${id}`)
    }
    if(user.cart.includes(product._id)){
      user.cart.pull(product._id)
    }
    user.orders.push(product._id)
    await user.save()
    req.flash("success","Product Has Been Ordered")
    return res.redirect("/user/dashboard")
  } catch (error) {
    dbgr(error.message)
  }
})

module.exports = router;
