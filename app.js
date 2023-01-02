const path = require("path");
const session = require("express-session");
const flash = require("connect-flash");
const express = require("express");
const multer = require("multer");

const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

const isAuth = require("./middleware/is-auth");

const homeRoutes = require("./routes/backoffice/home/home");
const userRoutes = require("./routes/backoffice/users/index");
const bookRoutes = require("./routes/backoffice/books/index");
const authController = require("./routes/backoffice/auth/index");
const errorController = require("./controllers/backoffice/404/index");

const authFrontController = require("./routes/frontoffice/auth/index");
const homeUserRoutes = require("./routes/frontoffice/home/home");

const sequelize = require("./util/database");

app.use(
  session({
    secret: "123456",
    saveUninitialized: true,
    resave: true,
  })
);

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    cb(
      null,
      new Date().toISOString().replace(/:/g, "-") + "-" + file.originalname
    );
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

app.use(flash());
app.use(express.urlencoded({ extended: false }));
app.use(
  multer({
    storage: fileStorage,
    fileFilter: fileFilter,
  }).single("image")
);
app.use(express.static(path.join(__dirname, "public")));
app.use("/images", express.static(path.join(__dirname, "images")));
app.use("/public", express.static(path.join(__dirname, "public")));

// frontoffice
app.use("/", homeUserRoutes.router);
app.use("/login", authFrontController.router);

app.use((req, res, next) => {
  if (!req.url.includes("/backoffice")) {
    res.render("frontoffice/404/index", {
      isLoggedIn: false,
    });
  } else {
    next();
  }
});

// backoffice
app.use("/backoffice", homeRoutes.router);
app.use("/backoffice", userRoutes.router);
app.use("/backoffice", bookRoutes.router);
app.use("/backoffice", authController.router);

app.use(isAuth, errorController.get404);

sequelize
  .sync()
  .then((result) => {
    app.listen(3000, () => console.log("Server is running"));
  })
  .catch((err) => console.log(err));
