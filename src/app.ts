import 'module-alias/register';
import path from "path";

import express, { Request, Response, NextFunction } from "express";
import session from "express-session";
import flash from "connect-flash";

import sequelize from "@utils/connection";

import { closeRabbitMQ, connectRabbitMQ } from '@utils/rabbitmq';
import { redisClient } from '@utils/redis'
import language from '@utils/language';

// Backoffice
import backHomeRoutes from "./routes/backoffice/home/home";
import userRoutes from "@routes/backoffice/users/index";
import languageRoutes from '@routes/backoffice/language/index'

const app = express();

app.use(language())

app.use(async (req: Request, res: Response, next: NextFunction) => {
  const result = await redisClient.get('language')
  let language = 'en'

  if (result) {
    const languageSetting = JSON.parse(result)
    language = languageSetting.language
  }

  res.cookie('i18next', language)
  res.locals.translate = req.t;
  next();
});

app.use(
  session({
    secret: "123456",
    saveUninitialized: true,
    resave: true,
  })
);

app.use(express.json());
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
app.use("/backoffice", languageRoutes)

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