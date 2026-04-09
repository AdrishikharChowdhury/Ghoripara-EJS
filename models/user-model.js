const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");

const defaultImageBuffer = fs.readFileSync(
  path.join(__dirname, "../public/images/default-avatar.webp"),
);

const defaultAvatar = {
  buffer: defaultImageBuffer,
  mimetype: "image/webp",
};

const pfpSchema = new mongoose.Schema({
  buffer: { type: Buffer, required: true },
  mimetype: { type: String, required: true },
});

const userSchema = mongoose.Schema({
  name: String,
  email: String,
  password: String,
  cart: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "product",
    },
  ],
  orders: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "product",
    },
  ],
  contact: Number,
  pfp: {
    type: pfpSchema,
    default: defaultAvatar,
  },
});

module.exports = mongoose.model("user", userSchema);
