const isAdmin = (req, res, next) => {
  if (!req.user) {
    req.flash("error", "Please login first");
    return res.redirect("/login");
  }

  if (!req.user.isAdmin) {
    req.flash("error", "Access denied");
    return res.redirect("/");
  }

  next();
};

module.exports.isAdmin = isAdmin;