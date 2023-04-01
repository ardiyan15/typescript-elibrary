const bcrypt = require("bcryptjs");
const User = require("../../../models/backoffice/users/user");
const { encrypt } = require("../../../util/encrypted");

exports.getLogin = (req, res, next) => {
  res.render("frontoffice/auth/index");
};

exports.authLogin = async (req, res, next) => {
  const { username, password } = req.body;

  const user = await User.findOne({
    raw: true,
    where: { username: username, roles: "user" },
  });

  if (!user) {
    req.flash("failed", "Invalid username or password");
    res.redirect("/login");
  } else {
    const checkPassword = await bcrypt.compare(password, user.password);
    if (checkPassword) {
      req.session.isLoggedIn = true;
      delete user.email;
      delete user.password;
      delete user.image;
      delete user.createdAt;
      delete user.updatedAt;
      delete user.username;
      let frontOffice = {
        user,
      };
      req.session.frontOffice = frontOffice;
      res.redirect("/");
    } else {
      req.flash("failed", "Invalid username or password");
      res.redirect("/login");
    }
  }
};

exports.getRegister = (req, res, next) => {
  const flashMessage = req.flash("success");

  res.render("frontoffice/user/register", {
    isLoggedIn: false,
    flashMessage,
  });
};

exports.saveRegister = async (req, res, next) => {
  const { username, password, roles, email } = req.body;

  const passwordHashed = await bcrypt.hash(password, 12);

  const image = req.file;

  const imageUrl = image.path;

  User.create({
    username,
    password: passwordHashed,
    roles,
    email,
    image: imageUrl,
    roles: "user",
  })
    .then((result) => {
      req.flash("success", "Successfully Add User");
      res.redirect("/register/user");
    })
    .catch((err) => console.log(err));
};
