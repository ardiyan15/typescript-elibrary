import 'module-alias/register';
import dotenv from 'dotenv';
import path from "path";

import express, { NextFunction, Request, Response } from "express";
import session from "express-session";
import flash from "connect-flash";
import morgan from 'morgan';

import { logStream, logger, logTimestamp } from '@utils/log';
import { areDependenciesAvailable, getUnavailableDependencies } from '@utils/dependencyStatus';
import language from '@utils/language';

import menuMiddleware from '@middleware/menuMiddleware';
import languageMiddleware from '@middleware/languageMiddleware';
import { isAuthenticated } from '@middleware/authMiddleware';
import isAuthorized from '@middleware/authorizedMiddleware';

import { setupSwagger } from '@utils/swagger';

import apiRoutes from '@routes/api'
import authRoutes from '@routes/backoffice/auth/index'
import backofficeRoutes from '@routes/backoffice'
import frontOfficeRoutes from '@routes/frontoffice'

dotenv.config();

const app = express();

/**
 * Body Parser
 */
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


/**
 * Logger
 */
morgan.token('date', () => logTimestamp('DD/MMM/YYYY:HH:mm:ss ZZ'));
app.use(morgan("combined", { stream: logStream }));

/**
 * Language
 */
app.use(language())

/**
 * Session
 */
app.use(
  session({
    secret: "123456",
    saveUninitialized: true,
    resave: false,
  })
);

app.use(flash());

/**
 * Static Files
 */
app.use(express.static(path.join(__dirname, "public")));
app.use("/images", express.static(path.join(__dirname, "images")));
app.use("/public", express.static(path.join(__dirname, "public")));

/**
 * View Engine
 */
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.get('/500', (_: Request, res: Response) => {
  res.status(503).render('errors/500', {
    unavailableDependencies: getUnavailableDependencies()
  });
});

app.use((req: Request, res: Response, next: NextFunction) => {
  if (areDependenciesAvailable() || req.path === '/500') {
    return next();
  }
  return res.redirect('/500');
});

/**
 * Swagger and application routes are only available when dependencies are ready.
 */
setupSwagger(app)
app.use("/api/v1", apiRoutes)

/**
 * Authentication
 */
app.use("/backoffice", authRoutes)

app.use(isAuthenticated)

/**
 * Authorization & Global Middleware
 */
app.use(languageMiddleware);
app.use(menuMiddleware)
app.use(isAuthorized)

// Backoffice
app.use("/backoffice", backofficeRoutes);

app.use("/backoffice", (_, res) => {
  const menus = res.locals.menus ? [...res.locals.menus] : []
  res.render('backoffice/NotFound', {
    menus
  })
});

// Frontoffice
app.use("/", frontOfficeRoutes)

app.use((_, res) => {
  res.status(404).render('frontoffice/errors/NotFound');
})

/**
 * Error Handler
 */
app.use(
  (
    _err: Error,
    _: Request,
    res: Response,
    _next: NextFunction
  ) => {
    const menus = res.locals.menus ? [...res.locals.menus] : []
    logger.error(_err.stack)
    res.status(500).render("backoffice/Error", { menus })
  });

export default app;
