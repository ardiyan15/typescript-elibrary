import userRepository from "../repositories/userRepository";
import { IUser } from '../models/backoffice/users/user';
import { encrypt } from "../utils/secure";
import moment from "moment";

class UserService {
    async getAllUsers(): Promise<IUser[]> {
        const users = await userRepository.findAll()

        const encryptedData = users.map(user => {
            const encryptedId = encrypt(user.id.toString());
            const createdAt = moment(user.createdAt).format("D MMMM YYYY");
            const updatedAt = moment(user.updatedAt).format("D MMMM YYYY");

            return {
                id: encryptedId,
                username: user.username,
                password: user.password,
                roles: user.roles,
                email: user.email,
                image: user.image,
                createdAt,
                updatedAt
            }
        })

        return encryptedData
    }

    async getUserBydId(id: number | string): Promise<IUser | null> {
        const user = userRepository.findById(id)
        return user;
    }   

    async createUser(userData: IUser): Promise<IUser> {
        return userRepository.create(userData)
    }

    async updateUser(id: string, userData: Partial<IUser>): Promise<[number]> {
        delete userData.id
        return userRepository.update(id, userData)
    }

    async deleteUser(id: string): Promise<number> {
        return userRepository.delete(id)
    }
}

export default new UserService()