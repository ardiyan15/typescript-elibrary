import { Router } from "express";
import { orderBook } from "@controllers/api/order"

const router = Router()

/**
 * @swagger
 * /api/v1/order-book:
 *   post:
 *     summary: Books
 *     tags:
 *       - Books
 *     requestBody:
 *       required: true
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             properties:
 *               bookId:
 *                 type: array
 *                 default: [111444]
 *                 description: Enter your Book Id
 *               fullname:
 *                 type: string
 *                 default: John Doe
 *                 description: Enter your fullname
 *               address:
 *                 type: string
 *                 default: 123 Main St, Anytown, USA
 *                 description: Enter your address
 *             required:
 *               - bookId
 *               - fullname
 *               - address
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 responseCode:
 *                   type: integer
 *                   default: 200
 *                 responseMessage:
 *                   type: string
 *                   default: "success"
 *                 data:
 *                   type: object
 *                   properties:
 *                     result:
 *                       type: boolean
 *                       default: true
 *                     data:
 *                       type: object
 *                       properties:
 *                         fullname:
 *                           type: string
 *                           default: "John Doe"
 *                         address:
 *                           type: string
 *                           default: "123 Main St, Anytown, USA"
 *                         transactionId:
 *                           type: string
 *                           default: B2025012719044399999
 *                         quantity:
 *                           type: integer
 *                           default: 1
 *                         totalPrice:
 *                           type: integer
 *                           default: 99999
 *                         paymentStatus:
 *                           type: string
 *                           default: unpaid
 *                         orderDetails:
 *                           type: object
 *                           properties:
 *                              books:
 *                                type: array
 *                                items:
 *                                  type: object
 *                                  properties:
 *                                    id:
 *                                      type: integer
 *                                      default: 1
 *                                    title:
 *                                      type: string
 *                                      default: Filosofi Teras
 *                                    price:
 *                                      type: integer
 *                                      default: 99999
 *       404:
 *         description: Item Not Found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 responseCode:
 *                   type: integer
 *                   default: 404
 *                 responseMessage:
 *                   type: string
 *                   default: Failed
 *                 data:
 *                   type: object
 *                   properties:
 *                     message:
 *                       type: string
 *                       default: Item Not Found
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 responseCode:
 *                   type: integer
 *                   default: 500
 *                 responseMessage:
 *                   type: string
 *                   default: Failed
 *                 data:
 *                   type: object
 *                   properties:
 *                     message:
 *                       type: string
 *                       default: Internal Server Error
 */


router.post('/order-book', orderBook)

export default router