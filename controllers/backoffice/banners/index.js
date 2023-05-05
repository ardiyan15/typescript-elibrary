const moment = require("moment");
const encrypted = require("../../../util/encrypted");
const Banner = require("../../../models/backoffice/banners/banner");

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
      moment,
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
  const { title, type } = req.body;

  const image = req.file;
  const imagePath = image.path;

  try {
    await Banner.create({
      title,
      type,
      image: imagePath,
    });
    req.flash("success", "Successfully Add Banner");
    res.redirect("/backoffice/banners");
  } catch (e) {
    console.log(e);
  }
};
