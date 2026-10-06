import { Op } from "sequelize";
import UserRepository from "../../../../src/repositories/userRepository";
import User from "../../../../src/models/backoffice/users/user";
import SubMenu from "../../../../src/models/backoffice/submenus/submenu"
import { getRabbitChannel } from "../../../../src/utils/rabbitmq";

jest.mock('../../../../src/models/backoffice/users/user', () => ({
    __esModule: true,
    default: {
        findAndCountAll: jest.fn(),
        findOne: jest.fn(),
        findByPk: jest.fn(),
        destroy: jest.fn()
    }
}))

jest.mock('../../../../src/utils/rabbitmq', () => ({
    getRabbitChannel: jest.fn()
}))

describe("UserRepository - findAll", () => {

    it("should be return all users", async () => {
        const mockUsers = [
            {
                id: 2,
                username: 'user2'
            },
            {
                id: 1,
                username: 'user1'
            }
        ]
    
        ;(User.findAndCountAll as jest.Mock).mockResolvedValue({
            rows: mockUsers,
            count: 2
        })

        const result = await UserRepository.findAll(
            0,
            10,
            {
                value: '',
                regex: ''
            }
        )

        expect(result).toEqual({
            data: mockUsers,
            recordsTotal: 2,
            recordsFiltered: 2
        })

        expect(User.findAndCountAll).toHaveBeenCalledWith({
            where: {},
            offset: 0,
            limit: 10,
            order: [["id", "DESC"]]
        })
    })

    it('should return filtered users when search is provided', async () => {
        const mockUsers = [
            {
                id: 1,
                username: 'admin'
            }
        ]

            ; (User.findAndCountAll as jest.Mock).mockResolvedValue({
                rows: mockUsers,
                count: 1
            })

        const result = await UserRepository.findAll(
            0,
            10,
            {
                value: 'admin',
                regex: ''
            }
        )

        expect(result).toEqual({
            data: mockUsers,
            recordsTotal: 1,
            recordsFiltered: 1
        })

        expect(User.findAndCountAll).toHaveBeenCalledWith({
            where: {
                username: {
                    [Op.like]: '%admin%'
                }
            },
            offset: 0,
            limit: 10,
            order: [['id', 'DESC']]
        })
    })

})

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

describe("UserRepository - delete", () => {
    beforeEach(() => {
        jest.clearAllMocks()
    })

    it("should be return 1 when delete user is successfully", async () => {
        const userId = 9999;

        ;(User.destroy as jest.Mock).mockResolvedValue(1)

        const result = await UserRepository.delete(userId)

        expect(result).toBe(1)

        expect(User.destroy).toHaveBeenCalledWith({
            where: {
                id: userId
            }
        })
    })

    it("should be return 0 where delete user is failed", async () => {
        const userId = 9999

        ;(User.destroy as jest.Mock).mockResolvedValue(0)

        const result = await UserRepository.delete(userId)

        expect(result).toBe(0)

        expect(User.destroy).toHaveBeenCalledWith({
            where: {
                id: userId
            }
        })
    })
})

describe("UserRepository - bulkCreate", () => {
    const mockAssertQueue = jest.fn()
    const mockSendToQueue = jest.fn()

    beforeEach(() => {
        jest.clearAllMocks()

        mockAssertQueue.mockReset()
        mockSendToQueue.mockReset()
    
        ;(getRabbitChannel as jest.Mock).mockReturnValue({
            assertQueue: mockAssertQueue,
            sendToQueue: mockSendToQueue
        })
    })

    it("should send message to RabbitMQ and return success response", async () => {
        const path = "/uploads/users.xlsx"

        mockAssertQueue.mockResolvedValue(undefined)
        mockSendToQueue.mockReturnValue(true)

        const result = await UserRepository.bulkCreate(path)

        expect(result).toEqual({
            responseCode: 200,
            responseMessage: 'Success'
        })

        expect(getRabbitChannel).toHaveBeenCalled()
        expect(mockAssertQueue).toHaveBeenCalledWith('IMPORT_USER')

        const expectedMessage = JSON.stringify({
            messageType: 'Import User',
            path: path
        })

        expect(mockSendToQueue).toHaveBeenCalledWith(
            'IMPORT_USER',
            Buffer.from(expectedMessage)
        )
    })

    it("should return error response when sendToQueue throws an error", async () => {
        const path = "/uploads/users.xlsx"
        const mockError = new Error("RabbitMQ connection failed")

        mockAssertQueue.mockResolvedValue(undefined)
        mockSendToQueue.mockImplementation(() => {
            throw mockError
        })

        const result = await UserRepository.bulkCreate(path)

        expect(result).toEqual({
            responseCode: 500,
            responseMessage: mockError
        })

        expect(getRabbitChannel).toHaveBeenCalled()
        expect(mockAssertQueue).toHaveBeenCalledWith('IMPORT_USER')
    })
})