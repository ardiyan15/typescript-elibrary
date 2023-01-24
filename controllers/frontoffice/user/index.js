const { encrypt, decrypt } = require("../../../util/encrypted");
const User = require("../../../models/backoffice/users/user");

exports.index = async (req, res, next) => {
  let isLoggedIn = false;
  let userId = "";
  let id = "";

  if (req.session.user) {
    isLoggedIn = true;
    user = req.session.user;
    userId = decrypt(req.session.user.id);
    user.id = encrypt(user.id.toString());
  }

  id = encrypt(userId);

  let result = await User.findByPk(userId, {
    attributes: { exclude: ["password"] },
    raw: true,
  });

  res.render("frontoffice/user/index", {
    isLoggedIn,
    id,
    result,
  });
};

exports.updateUser = async (req, res, next) => {
  const { id } = req.params;

  console.log(id);
};
