import express from "express";
const router = express.Router();

import { index, login } from "@controllers/frontoffice/auth/index";

router.get("/auth", index);

router.post('/login', login)

export default router;
