import bcrypt from 'bcrypt'
import sequelize from "@utils/connection";
import User, { IUser } from "@models/backoffice/users/user";

class ProfileRepository {
    async update(id: string, userData: Partial<IUser>): Promise<[number]> {

        const updateData: IUser = {
            username: userData.username,
            email: userData.email,
            roles: userData.roles
        }

        if (userData.password) {
            updateData.password = await bcrypt.hash(userData.password, 10)
        }

        if (userData.image) {
            updateData.image = userData.image
        }

        const transaction = await sequelize.transaction()

        try {
            const user = await User.update(updateData, { where: { id }, transaction });
            await transaction.commit()
            return user
        } catch (error) {
            await transaction.rollback()
            return error
        }
    }
}

export default new ProfileRepository()