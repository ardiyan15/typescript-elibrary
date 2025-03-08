import { Request } from "express"
import bcrypt from 'bcrypt'

import CustomerRepository from "@repositories/frontoffice/customerRepository"
import { encrypt } from "@utils/secure";
import { generateToken } from '@utils/jwt'


declare module 'express-session' {
    interface SessionData {
        frontoffice: {
            jwt?: string
        }
    }
}

class CustomerService {
    async verifyCustomer(email: string, password: string) {
        const customer = await CustomerRepository.findByEmail(email)
        let result
        if (customer) {
            const isPasswordValid = await bcrypt.compare(password, customer.password)
            if (isPasswordValid) {
                delete customer.password
                result = {
                    isCustomerValid: true,
                    data: customer
                }

                return result
            }
        }

        return {
            isCustomerValid: false,
            data: null
        }
    }

    async generateJwtToken(dataId: string | number, dataEmail: string): Promise<string> {
        const id = encrypt(dataId.toString())
        const email = encrypt(dataEmail)

        const payload = { id, email }
        const token = generateToken(payload)
        return token
    }

    async storeJwtToken(req: Request, token: string): Promise<void> {
        if (!req.session.frontoffice) req.session.frontoffice = {}
        req.session.frontoffice.jwt = token
    }
}

export default new CustomerService()