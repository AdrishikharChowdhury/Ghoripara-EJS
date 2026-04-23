const jwt = require("jsonwebtoken");

const generateAdminToken = (owner) => {
  const { email, _id, isAdmin } = owner;
  return jwt.sign({ email, id: _id,isAdmin }, process.env.JWT_KEY);
};

module.exports.generateAdminToken = generateAdminToken;
