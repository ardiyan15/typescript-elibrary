import path from "path";

import express from "express";

import sequelize from "./utils/connection";

// Backoffice
import backHomeRoutes from "./routes/backoffice/home/home";

// FrontOffice
import homeRoutes from "./routes/frontoffice/home/home";
import Book from "./models/backoffice/books/book";
import Rating from "./models/frontoffice/rating";

const app = express();

app.use(express.static(path.join(__dirname, "public")));
app.use("/images", express.static(path.join(__dirname, "images")));
app.use("/public", express.static(path.join(__dirname, "public")));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Backoffice
app.use("/backoffice", backHomeRoutes);

// Frontoffice
app.use("/", homeRoutes);

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
