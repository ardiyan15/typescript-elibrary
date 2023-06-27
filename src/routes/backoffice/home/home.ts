import express from "express";
const router = express.Router();

import { getHome } from "../../../controllers/backoffice/home/home";

router.get("/", getHome);

export default router;
