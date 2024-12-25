import 'module-alias/register';
import path from "path";

import express from "express";
import session from "express-session";
import flash from "connect-flash";

import { sequelize } from '@models/index'

import { closeRabbitMQ, connectRabbitMQ } from '@utils/rabbitmq';
import language from '@utils/language';

// Backoffice
import backHomeRoutes from "@routes/backoffice/home/home";
import userRoutes from "@routes/backoffice/users/index";
import languageRoutes from '@routes/backoffice/language/index'

import menuMiddleware from '@middleware/menuMiddleware';
import languageMiddleware from '@middleware/languageMiddleware';

const app = express();

app.use(language())

app.use(
  session({
    secret: "123456",
    saveUninitialized: true,
    resave: true,
  })
);

app.use(languageMiddleware);
app.use(menuMiddleware)

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(flash());
app.use(express.static(path.join(__dirname, "public")));
app.use("/images", express.static(path.join(__dirname, "images")));
app.use("/public", express.static(path.join(__dirname, "public")));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Backoffice
app.use("/backoffice", backHomeRoutes);
app.use("/backoffice", userRoutes)
app.use("/backoffice", languageRoutes)

sequelize
  .sync({ alter: true })
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