const bcrypt = require("bcryptjs");
const encrypted = require("../../../util/encrypted");
const User = require("../../../models/backoffice/users/user");

exports.getUsers = (req, res, next) => {
  const flashMessage = req.flash("success");
  User.findAll()
    .then((users) => {
      res.render("backoffice/users/index", {
        users,
        encrypt: encrypted.encrypt,
        flashMessage,
      });
    })
    .catch((err) => console.log(err));
};

exports.getAddUser = (req, res, next) => {
  res.render("backoffice/users/form", {
    formTitle: "Add User",
    buttonText: "Submit",
    user: [],
  });
};

exports.getUser = (req, res, next) => {
  const userId = encrypted.decrypt(req.params.id, req.params.id);

  User.findByPk(userId)
    .then((user) => {
      let userIdEncrypted = encrypted.encrypt(userId);
      res.render("backoffice/users/form", {
        formTitle: "Edit User",
        buttonText: "Update",
        user,
        userIdEncrypted,
      });
    })
    .catch((err) => console.log(err));
};

exports.saveUser = async (req, res, next) => {
  const { username, password, roles, email } = req.body;

  const passwordHashed = await bcrypt.hash(password, 12);

  User.create({
    username,
    password: passwordHashed,
    roles,
    email,
  })
    .then((result) => {
      req.flash("success", "Successfully Add User");
      res.redirect("/backoffice/users");
    })
    .catch((err) => console.log(err));
};

exports.updateUser = (req, res, next) => {
  const { id, username, password, roles, email } = req.body;

  let userDecrypted = encrypted.decrypt(id);

  User.findByPk(userDecrypted)
    .then((user) => {
      user.username = username;
      if (password) {
        user.password = password;
      }
      user.roles = roles;
      user.email = email;
      user.save();
      req.flash("success", "Successfully update user");
      res.redirect("/backoffice/users");
    })
    .catch((err) => console.log(err));
};

exports.deleteUser = (req, res, next) => {
  const { userId } = req.body;

  let userIdDecrypted = encrypted.decrypt(userId);

  User.findByPk(userIdDecrypted)
    .then((user) => {
      return user.destroy();
    })
    .then((result) => {
      req.flash("success", "Successfully delete user");
      res.redirect("/backoffice/users");
    })
    .catch((err) => console.log(err));
};
