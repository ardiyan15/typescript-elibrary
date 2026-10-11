import subMenuRepository from "../../../../src/repositories/subMenuRepository"
import Submenu from "../../../../src/models/backoffice/submenus/submenu"
import Menu from "../../../../src/models/backoffice/menus/menu"

jest.mock("../../../../src/models/backoffice/submenus/submenu", () => ({
    __esModule: true,
    default: {
        findAll: jest.fn()
    }
}))

describe("SubMenuRepository - findAll", () => {
    beforeEach(() => jest.clearAllMocks())

    it("returns all submenus including their associated menu", async () => {
        const submenus = [
            { id: 1, name: "Books", code: "BOOKS", url: "/books", menuId: 2 },
            { id: 2, name: "Users", code: "USERS", url: "/users", menuId: 3 }
        ]
        ;(Submenu.findAll as jest.Mock).mockResolvedValue(submenus)

        const result = await subMenuRepository.findAll()

        expect(result).toEqual(submenus)
        expect(Submenu.findAll).toHaveBeenCalledTimes(1)
        expect(Submenu.findAll).toHaveBeenCalledWith({
            include: [{ model: Menu, as: "menu" }]
        })
    })

    it("returns an empty list when no submenus exist", async () => {
        ;(Submenu.findAll as jest.Mock).mockResolvedValue([])

        const result = await subMenuRepository.findAll()

        expect(result).toEqual([])
        expect(Submenu.findAll).toHaveBeenCalledWith({
            include: [{ model: Menu, as: "menu" }]
        })
    })
})
