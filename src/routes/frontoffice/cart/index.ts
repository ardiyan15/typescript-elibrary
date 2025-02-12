import express from "express";
const router = express.Router();

import { index } from "@controllers/frontoffice/cart/index";

router.get("/cart", index);

export default router;
