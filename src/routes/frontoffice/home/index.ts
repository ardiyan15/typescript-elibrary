import express from "express";
const router = express.Router();

import { getHome } from "@controllers/frontoffice/home/index";

router.get("/", getHome);

export default router;
