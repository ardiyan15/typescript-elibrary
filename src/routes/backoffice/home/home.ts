import express from "express";
const router = express.Router();

import { getHome } from "../../../controllers/backoffice/home/home";

router.get("/home", getHome);

export default router;
