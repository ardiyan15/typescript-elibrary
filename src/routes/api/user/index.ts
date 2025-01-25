import { Router } from "express";
import { index } from "@controllers/api/user";

const router = Router();

/**
 * @swagger
 * /api/v1/users:
 *   get:
 *     summary: Get list of users
 *     tags:
 *       - Users
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   name:
 *                     type: string
 */
router.get("/users", index);

export default router