import Customer from "@models/frontoffice/customer/customer";

class CustomerRepository {
    async findByEmail(email: string) {
        return (await Customer.findOne({ where: { email } })).get({plain: true})
    }
}

export default new CustomerRepository()