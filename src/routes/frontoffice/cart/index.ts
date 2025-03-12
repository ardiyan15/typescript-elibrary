import express from "express";
const router = express.Router();
import { isAuthenticated } from "@middleware/frontoffice/authMiddleware";

import { index, add } from "@controllers/frontoffice/cart/index";

router.get("/cart", isAuthenticated, index);

router.post('/cart', add)

export default router;
