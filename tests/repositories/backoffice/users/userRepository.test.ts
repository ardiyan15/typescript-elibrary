import UserRepository from "../../../../src/repositories/userRepository";
import User from "../../../../src/models/backoffice/users/user";
import SubMenu from "../../../../src/models/backoffice/submenus/submenu"

jest.mock('../../../../src/models/backoffice/users/user', () => ({
    __esModule: true,
    default: {
        findOne: jest.fn(),
        findByPk: jest.fn()
    }
}))

describe('UserRepository - findByUsername', () => {

    beforeEach(() => {
        jest.clearAllMocks()
    })

    it("should return user when username exists", async () => {
        const mockUser = {
            id: 1,
            username: 'admin',
            email: 'admin@mail.com'
        }

        ;(User.findOne as jest.Mock).mockResolvedValue(mockUser)

        const result = await UserRepository.findByUsername('admin')

        expect(result).toEqual(mockUser)

        expect(User.findOne).toHaveBeenCalledWith({
            where: {
                username: 'admin'
            }
        })
    })

    it("should return null when username does not exist", async () => {
        ;(User.findOne as jest.Mock).mockResolvedValue(null)

        const result = await UserRepository.findByUsername('notfound')

        expect(result).toBeNull()

        expect(User.findOne).toHaveBeenCalledWith({
            where: {
                username: 'notfound'
            }
        })
    })
})

describe("UserRepository - findById", () => {

    beforeEach(() => {
        jest.clearAllMocks()
    })

    it("should be return user with submenu if user exists", async () => {

        const userId = 1;

        const mockUser = {
            id: userId,
            username: 'admin',
            email: 'admin@mail.com'
        }

        ;(User.findByPk as jest.Mock).mockResolvedValue(mockUser)

        const result = await UserRepository.findById(userId)

        expect(result).toEqual(mockUser)

        expect(User.findByPk).toHaveBeenCalledWith(userId, {
            include: [
                {
                    model: SubMenu,
                    as: 'submenu'
                }
            ]
        })
    })

    it("should be return null when user not found", async () => {
        const userId = 9999
        
        ;(User.findByPk as jest.Mock).mockResolvedValue(null)

        const result = await UserRepository.findById(userId)

        expect(result).toBeNull()

        expect(User.findByPk).toHaveBeenCalledWith(userId, {
            include: [
                {
                    model: SubMenu,
                    as: 'submenu'
                }
            ]
        })
    })
})