import { Router } from "express";
import { orderBook } from "@controllers/api/transaction"

const router = Router()

/**
 * @swagger
 * /api/v1/order-book:
 *   post:
 *     summary: Order Book
 *     tags:
 *       - Order Book
 *     requestBody:
 *      required: true
 *      content:
 *         application/x-www-form-urlencoded:
 *              schema:
 *                  type: object
 *                  properties:
 *                      bookId:
 *                          type: array
 *                          default: [111444]
 *                          description: Enter your Book Id
 *                      name:
 *                          type: string
 *                          default: John Doe
 *                          required: true
 *                          description: Enter your name
 *                      address:
 *                          type: string
 *                          default: 123 Main St, Anytown, USA
 *                          required: true
 *                          description: Enter your address
 *                  required:
 *                      - bookId
 *                      - name
 *                      - address
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                  responseCode:
 *                     type: integer
 *                     default: 200
 *                  responseMessage:
 *                     type: integer
 *                     default: "success"
 *                  data: 
 *                     type: object
 *                     properties:
 *                         id:
 *                             type: integer
 *                             default: 1ryejhasdjhasdasd7128123nsdjfjfpqezx
 *                         name:
 *                             type: string
 *                             default: "John Doe"
 *                         address:
 *                             type: string
 *                             default: "123 Main St, Anytown, USA"
 *                         amount:
 *                             type: integer
 *                             default: 50000
 *       404:
 *         description: Item Not Found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                  responseCode:
 *                     type: integer
 *                     default: 404
 *                  responseMessage:
 *                     type: integer
 *                     default: Failed
 *                  data:
 *                     type: object
 *                     properties:
 *                        message:
 *                          type: string
 *                          default: Item Not Found
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                  responseCode:
 *                     type: integer
 *                     default: 500
 *                  responseMessage:
 *                     type: integer
 *                     default: Failed
 *                  data:
 *                     type: object
 *                     properties:
 *                        message:
 *                          type: string
 *                          default: Internal Server Error
 */

router.post('/order-book', orderBook)

export default router