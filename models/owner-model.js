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

const ownerSchema = mongoose.Schema({
  name: {
    type: String,
    minLength: 5,
    trim: true,
  },
  email: String,
  password: String,
  pfp: {
    type: pfpSchema,
    default: defaultAvatar,
  },
  isAdmin: {
    type: Boolean,
    default: true
  }
});

module.exports = mongoose.model("Owner", ownerSchema);
