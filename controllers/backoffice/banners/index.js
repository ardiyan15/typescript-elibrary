const encrypted = require("../../../util/encrypted");
const Banner = require("../../../models/backoffice/users/user");

exports.getBanners = async (req, res, next) => {
  const flashMessage = req.flash("success");

  try {
    let banners = await Banner.findAll({
      order: [["id", "DESC"]],
    });
    res.render("backoffice/banners/index", {
      banners,
      encrypt: encrypted.encrypt,
      flashMessage,
    });
  } catch (e) {
    console.log(e);
  }
};

exports.getForm = async (req, res, next) => {
  try {
    res.render("backoffice/banners/form", {
      formTitle: "Add Banner",
      banner: [],
    });
  } catch (e) {
    console.log(e);
  }
};

exports.saveBanner = async (req, res, next) => {
  //   console.log(req.body);
  console.log("here");
};
