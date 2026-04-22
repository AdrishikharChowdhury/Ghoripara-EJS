const jwt = require("jsonwebtoken");

const isLoggedIn = (req, res, next) => {
  try {
    const token = req.cookies?.token;

    if (!token) {
      return res.status(401).send("You must be logged in");
    }

    const data = jwt.verify(token, process.env.JWT_KEY);
    req.user = data;

    next();
  } catch (error) {
    return res.status(401).send("Invalid or expired token");
  }
};

module.exports.isLoggedIn = isLoggedIn;