import User, { IUser } from "../models/backoffice/users/user";

class UserRepository {
    async findAll(): Promise<IUser[]> {
        return User.findAll({
            order: [['id', 'DESC']]
        })
    }

    async findById(id: number | string): Promise<IUser | null> {
        return User.findByPk(id)
    }

    async create(userData: IUser): Promise<User> {
        return User.create(userData)
    }

    async update(id: string, userData: Partial<IUser>): Promise<[number]> {
        delete userData.id
        return User.update(userData, { where: { id } });
    }

    async delete(id: string): Promise<number> {
        return User.destroy({where: {id}})
    }
}

export default new UserRepository()