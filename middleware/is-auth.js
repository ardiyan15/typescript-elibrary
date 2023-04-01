module.exports = (req, res, next) => {
  console.log(req.session);
  if (!req.session.backOffice || req.session.backOffice.roles != "admin") {
    return res.redirect("/backoffice");
  }
  next();
};
