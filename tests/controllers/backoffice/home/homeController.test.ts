import { getHome } from "../../../../src/controllers/backoffice/home/home";
import { Request, Response } from 'express'

describe("Home Controller", () => {
    it('should render the home page', () => {
        const req = {} as Request
        const res = {
            render: jest.fn()
        } as unknown as Response

        getHome(req, res)

        expect(res.render).toHaveBeenCalledWith("backoffice/home/index")
    })
})