import { Book } from '@customTypes/book'

export interface OrderData {
    orderDetails: {
        books: Book[]
    }
}