import dotenv from 'dotenv';
import 'module-alias/register';
import path from "path";

import express, { NextFunction, Request, Response } from "express";
import session from "express-session";
import flash from "connect-flash";
import morgan from 'morgan';
// import helmet from 'helmet';

import { sequelize } from '@models/index'

import { closeRabbitMQ, connectRabbitMQ } from '@utils/rabbitmq';
import language from '@utils/language';
import { logStream, logger } from '@utils/log';

import menuMiddleware from '@middleware/menuMiddleware';
import languageMiddleware from '@middleware/languageMiddleware';
import { isAuthenticated } from '@middleware/authMiddleware';
import isAuthorized from '@middleware/authorizedMiddleware';
import { setupSwagger } from '@utils/swagger';
// import { sendMessage } from '@utils/telegram';

// API
import apiRoutes from '@routes/api'

// backiffice
import authRoutes from '@routes/backoffice/auth/index'
import backofficeRoutes from '@routes/backoffice'

dotenv.config();
const port = process.env.PORT || 3000;

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// app.use(helmet.contentSecurityPolicy({
//   directives: {
//     defaultSrc: ["'self'"],
//     scriptSrc: ["'self'", "https://cdn.datatables.net"]
//   }
// }))

app.use(morgan("combined", { stream: logStream }));

setupSwagger(app)

app.use("/api/v1", apiRoutes)

app.use(language())

app.use(
  session({
    secret: "123456",
    saveUninitialized: true,
    resave: true,
  })
);

app.use(flash());
app.use(express.static(path.join(__dirname, "public")));
app.use("/images", express.static(path.join(__dirname, "images")));
app.use("/public", express.static(path.join(__dirname, "public")));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use("/backoffice", authRoutes)

app.use(isAuthenticated)

app.use(languageMiddleware);
app.use(menuMiddleware)
app.use(isAuthorized)

// Backoffice
app.use("/backoffice", backofficeRoutes);

app.use((_, res) => {
  const menus = res.locals.menus ? [...res.locals.menus] : []
  res.render('backoffice/NotFound', {
    menus
  })
});

app.use((_err: Error, _: Request, res: Response, _next: NextFunction) => {
  // sendMessage(err.message)
  const menus = res.locals.menus ? [...res.locals.menus] : []
  console.log(_err)
  logger.error(_err.stack)
  res.status(500).render("backoffice/Error", { menus })
});

sequelize
  .sync({ alter: true })
  .then(async () => {
    await connectRabbitMQ()
    app.listen(port, () => console.log("Server is running"));
  })
  .catch((err) => {
    console.log(err);
  });

process.on('SIGINT', async () => {
  await closeRabbitMQ()
  process.exit(0)
})