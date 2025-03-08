import { Request, Response } from "express";

import CustomerService from "@services/frontoffice/customerService";
export const index = (_: Request, res: Response) => {
    res.render("frontoffice/auth/index");
};

export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body
    const customer = await CustomerService.verifyCustomer(email, password)

    if (customer.isCustomerValid) {
        const token = await CustomerService.generateJwtToken(customer.data.id, customer.data.email)
        await CustomerService.storeJwtToken(req, token)
    }

    res.redirect('/')
}