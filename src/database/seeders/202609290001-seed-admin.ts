import { QueryInterface } from "sequelize";
import bcrypt from 'bcrypt'

export async function up(queryInterface: QueryInterface): Promise<void> {
    const password = await bcrypt.hash('123456', 10)

    await queryInterface.bulkInsert('users', [
        {
            username: 'Administrator',
            password,
            roles: 'admin',
            email: 'admin@library.test',
            image: null,
            createdAt: new Date(),
            updatedAt: new Date(),
        }
    ])
}

export async function down(queryInterface: QueryInterface): Promise<void> {
    await queryInterface.bulkDelete('users', {
        email: 'admin@library.test'
    })
}