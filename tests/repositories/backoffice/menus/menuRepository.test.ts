import menuRepository from "../../../../src/repositories/menuRepository"
import Menu from "../../../../src/models/backoffice/menus/menu"

jest.mock("../../../../src/models/backoffice/menus/menu", () => ({
    __esModule: true,
    default: {
        findAll: jest.fn()
    }
}))

describe("MenuRepository - findAll", () => {
    beforeEach(() => jest.clearAllMocks())

    it("returns all menus from the model", async () => {
        const menus = [
            { id: 1, name: "Dashboard", order: 1 },
            { id: 2, name: "Catalog", order: 2 }
        ]
        ;(Menu.findAll as jest.Mock).mockResolvedValue(menus)

        const result = await menuRepository.findAll()

        expect(result).toEqual(menus)
        expect(Menu.findAll).toHaveBeenCalledTimes(1)
        expect(Menu.findAll).toHaveBeenCalledWith()
    })

    it("returns an empty list when no menus exist", async () => {
        ;(Menu.findAll as jest.Mock).mockResolvedValue([])

        const result = await menuRepository.findAll()

        expect(result).toEqual([])
        expect(Menu.findAll).toHaveBeenCalledTimes(1)
    })
})
