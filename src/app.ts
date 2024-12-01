import 'module-alias/register';
import path from "path";

import express from "express";
import session from "express-session";
import flash from "connect-flash";

import sequelize from "@utils/connection";

// Backoffice
import backHomeRoutes from "./routes/backoffice/home/home";
import userRoutes from "@routes/backoffice/users/index";

import { closeRabbitMQ, connectRabbitMQ } from '@utils/rabbitmq';

const app = express();

app.use(
  session({
    secret: "123456",
    saveUninitialized: true,
    resave: true,
  })
);

app.use(express.urlencoded({ extended: false }));

app.use(flash());
app.use(express.static(path.join(__dirname, "public")));
app.use("/images", express.static(path.join(__dirname, "images")));
app.use("/public", express.static(path.join(__dirname, "public")));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Backoffice
app.use("/backoffice", backHomeRoutes);
app.use("/backoffice", userRoutes)

sequelize
  .sync()
  .then(async () => {
    await connectRabbitMQ()
    app.listen(3000, () => console.log("Server is running"));
  })
  .catch((err) => {
    console.log(err);
  });

process.on('SIGINT', async () => {
  await closeRabbitMQ()
  process.exit(0)
})