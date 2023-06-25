import path from "path";

import express from "express";

import sequelize from "./utils/connection";

import homeRoutes from "./routes/frontoffice/home/home";

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use("/", homeRoutes);

// sequelize
//   .sync()
//   .then(() => {
//     app.listen(3000, () => console.log("Server is running"));
//   })
//   .catch((err) => {
//     console.log(err);
//   });
