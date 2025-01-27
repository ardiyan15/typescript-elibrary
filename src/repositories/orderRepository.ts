import OrderDetails from "@models/backoffice/orderDetails"
import Order from "@models/backoffice/orders"
import sequelize from "@utils/connection"
import { OrderData } from "@customTypes/order"
import { Book } from '@customTypes/book'

class OrderRepository {

    async findLasTrx() {
        const order = await Order.findOne({
            attributes: ['transactionId'],
            order: [['id', 'DESC']],
            limit: 1
        })
        return order.get({ plain: true })
    }
    async create(data: OrderData) {
        const {orderDetails, ...orderInfo} = data
        const { books } = orderDetails
        
        const transaction = await sequelize.transaction()
        try {
            const order = await Order.create(orderInfo, { transaction })

            const orderDetailsData = books.map((book: Book) => ({
                orderId: order.id,
                bookId: book.id,
                price: book.price
            }))

            await OrderDetails.bulkCreate(orderDetailsData, { transaction })
            await transaction.commit()
            return {
                result: true,
                data: data
            }
        } catch (error) {
            await transaction.rollback()
            return {
                result: false,
                data: error.message
            }
        }
    }
}

export default new OrderRepository()