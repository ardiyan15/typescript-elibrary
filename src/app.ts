import fs from "fs";
import path from "path";

import express, { RequestHandler } from "express";
import session from "express-session";
import multer from "multer";
import flash from "connect-flash";

import sequelize from "./utils/connection";

// Backoffice
import backHomeRoutes from "./routes/backoffice/home/home";
import bookRoutes from "./routes/backoffice/books/index";
import userRoutes from "./routes/backoffice/users/index";

// FrontOffice
// import homeRoutes from "./routes/frontoffice/home/home";
import Book from "./models/backoffice/books/book";
import Rating from "./models/frontoffice/rating";

interface MulterRequest extends Request {
  file: any;
}

const app = express();

app.use(
  session({
    secret: "123456",
    saveUninitialized: true,
    resave: true,
  })
);

app.use(express.urlencoded({ extended: false }));

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

// const fileFilter: RequestHandler = (req, file, next) => {
//   if(file) {
//     if(file.mimetype === "image/png")
//   }
// }

app.use(flash());
// app.use(express.urlencoded({ extended: false }))
// app.use(
//   multer({
//     storage: fileStorage,

//   })
// )
app.use(express.static(path.join(__dirname, "public")));
app.use("/images", express.static(path.join(__dirname, "images")));
app.use("/public", express.static(path.join(__dirname, "public")));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Backoffice
app.use("/backoffice", backHomeRoutes);
app.use("/backoffice", bookRoutes);
app.use("/backoffice", userRoutes)

// Frontoffice
// app.use("/", homeRoutes);

Book.hasMany(Rating, {
  foreignKey: "bookId",
});

Rating.belongsTo(Book);

sequelize
  .sync()
  .then(() => {
    app.listen(3000, () => console.log("Server is running"));
  })
  .catch((err) => {
    console.log(err);
  });
