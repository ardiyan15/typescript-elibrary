const fs = require("fs");
const path = require("path");
const session = require("express-session");
const flash = require("connect-flash");
const express = require("express");
const multer = require("multer");
const csrf = require("csurf");

const app = express();

// const csrfProtection = csrf();

app.set("view engine", "ejs");
app.set("views", "views");

const isAuth = require("./middleware/is-auth");

// Backooffice Routes
const homeRoutes = require("./routes/backoffice/home/home");
const userRoutes = require("./routes/backoffice/users/index");
const bookRoutes = require("./routes/backoffice/books/index");
const bannerRoutes = require("./routes/backoffice/banners/index");
const categoriesRoutes = require("./routes/backoffice/categories/index");
const transactionRoutes = require("./routes/backoffice/transactions/index");
const authController = require("./routes/backoffice/auth/index");
const errorController = require("./controllers/backoffice/404/index");

// Frontoffice Routes
const authFrontController = require("./routes/frontoffice/auth/index");
const homeUserRoutes = require("./routes/frontoffice/home/home");
const frontUserRoutes = require("./routes/frontoffice/user/index");
const borrowRoutes = require("./routes/frontoffice/borrow/index");

// API Routes
const test = require("./routes/api/test");

const sequelize = require("./util/database");
const Book = require("./models/backoffice/books/book");
const Rating = require("./models/frontoffice/rating");
const User = require("./models/backoffice/users/user");

app.use(
  session({
    secret: "123456",
    saveUninitialized: true,
    resave: true,
  })
);

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const { destination } = req.body;
    const userDir = `./images/${destination}`;
    if (!fs.existsSync(userDir)) {
      fs.mkdirSync(userDir, { recursive: true });
    }
    if (destination != null) {
      cb(null, `images/${destination}`);
    } else {
      cb(null, "images");
    }
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

app.use("/api/v1", test.router);

// frontoffice
app.use("/", homeUserRoutes.router);
app.use("/", frontUserRoutes.router);
app.use("/", borrowRoutes.router);
app.use("/login", authFrontController.router);
app.use("/register", authFrontController.router);

// app.use(csrfProtection);

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
app.use("/backoffice", bannerRoutes.router);
app.use("/backoffice", categoriesRoutes.router);
app.use("/backoffice", transactionRoutes.router);
app.use("/backoffice", authController.router);

app.use(isAuth, errorController.get404);

Book.hasMany(Rating, {
  foreignKey: "bookId",
});

User.hasMany(Rating, {
  foreignKey: "userId",
});

Rating.belongsTo(Book);
Rating.belongsTo(User);

sequelize
  .sync()
  .then(() => {
    app.listen(3000, () => console.log("Server is running"));
  })
  .catch((err) => console.log(err));
