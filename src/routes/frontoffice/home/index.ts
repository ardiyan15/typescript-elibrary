import express from "express";
const router = express.Router();

import { detail, getHome } from "@controllers/frontoffice/home/index";

router.get("/", getHome);

router.get('/detail/:id', detail)

export default router;
