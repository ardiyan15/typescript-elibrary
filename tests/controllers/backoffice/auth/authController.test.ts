import { Request, Response } from "express";
import { Session, SessionData } from "express-session";

import { index, login, logout } from "../../../../src/controllers/backoffice/auth/index";
import userService from "../../../../src/services/userService"
import { logger, logFormatter } from "../../../../src/utils/log"
import { IUserLogin } from "../../../../src/generals/Interfaces"

jest.mock("../../../../src/services/userService")
jest.mock("../../../../src/utils/log")

interface CustomSession extends Session, SessionData {
    jwt?: string;
    reload: (callback: (err: any) => void) => this;
    resetMaxAge: () => this;
    save: (callbak: (err: any) => void) => this;
    touch: () => this
}


describe("Auth Controller - index", () => {
    let req: Partial<Request & { session: CustomSession }>;
    let res: Partial<Response>;
    let redirectMock: jest.Mock;
    let renderMock: jest.Mock;
    let flashMock: jest.Mock;

    beforeEach(() => {
        redirectMock = jest.fn();
        renderMock = jest.fn();
        flashMock = jest.fn().mockReturnValue(["login failed"]);

        req = {
            flash: flashMock,
            session: {
                id: "mock-session-id",
                jwt: undefined,
                regenerate: jest.fn(),
                destroy: jest.fn(),
                cookie: {} as any,
                reload: jest.fn((callback: (err: any) => void) => callback(null)) as any,
                resetMaxAge: jest.fn(() => req.session!),
                save: jest.fn(),
                touch: jest.fn(),
            },
        };
    });

    it("should be redirect to '/backoffice/home' if jwt exists", async () => {
        req.session!.jwt = 'valid_token'
        res = {
            redirect: redirectMock
        }

        await index(req as Request, res as Response);

        expect(redirectMock).toHaveBeenCalledWith("/backoffice/home")
    })

    it("should be render 'backoffice/auth' if jwt does not exists", async () => {
        req.session!.jwt = undefined
        res = {
            render: renderMock
        }

        await index(req as Request, res as Response)

        expect(renderMock).toHaveBeenCalledWith("backoffice/auth", {
            flashMessage: ['login failed']
        })
    })
});

describe("Auth Controller - Login", () => {
    let req: Partial<Request>
    let res: Partial<Response>

    beforeEach(() => {
        req = {
            body: { username: 'testuser', password: 'testpassword' },
            flash: jest.fn(),
            originalUrl: '/backoffice/login'
        }

        res = {
            redirect: jest.fn()
        };

        const mockResult = {
            isUserValid: true,
            data: {
                id: 1,
                username: 'testuser',
            }
        };

        (userService.verifyUser as jest.Mock).mockResolvedValue(mockResult);
        (userService.generateJwtToken as jest.Mock).mockResolvedValue('mockToken');
        (userService.storeJwtToken as jest.Mock).mockImplementation(() => { });
        (logFormatter as jest.Mock).mockReturnValue('mockLogData');
        (logger.info as jest.Mock).mockImplementation(() => { });
    })

    it("should login successfully and redirect to home", async () => {
        await login(req as Request, res as Response)

        expect(userService.verifyUser).toHaveBeenCalledWith('testuser', 'testpassword')
        expect(userService.generateJwtToken).toHaveBeenCalledWith(1, 'testuser')
        expect(userService.storeJwtToken).toHaveBeenCalledWith(req, 'mockToken')
        expect(logger.info).toHaveBeenCalledWith('mockLogData')
        expect(res.redirect).toHaveBeenCalledWith('/backoffice/home')
    });

    it('should fail login and redirect back', async () => {
        const mockResult: IUserLogin = {
            isUserValid: false,
            data: null
        };

        (userService.verifyUser as jest.Mock).mockResolvedValue(mockResult);
        (logFormatter as jest.Mock).mockReturnValue('mockLogData');
        (logger.info as jest.Mock).mockImplementation(() => { });

        await login(req as Request, res as Response);

        expect(userService.verifyUser).toHaveBeenCalledWith('testuser', 'testpassword')
        expect(logger.info).toHaveBeenCalledWith('mockLogData')
        expect(req.flash).toHaveBeenCalledWith('failed', 'Invalid Username or Password')
        expect(res.redirect).toHaveBeenCalledWith('/backoffice')
    })
})

describe("Auth Controller - Logout", () => {
    let req: Partial<Request>
    let res: Partial<Response>

    beforeEach(() => {
        jest.clearAllMocks();
        jest.resetAllMocks();

        req = {
            session: {
                id: "mock-session-id",
                jwt: "mock-jwt-token",
                destroy: jest.fn(),
                regenerate: jest.fn(),
                cookie: {} as any,
                reload: jest.fn((callback: (err: any) => void) => callback(null)) as any,
                resetMaxAge: jest.fn(() => req.session!),
                save: jest.fn(),
                touch: jest.fn(),
            } as Session
        };

        res = {
            redirect: jest.fn(),
            send: jest.fn()
        };

        (logFormatter as jest.Mock).mockReturnValue("Logout Failed!");
    });


    it("should redirect to '/backoffice' on successful logout", () => {
        const destroyMock = jest.fn((callback) => callback(null));
        req.session!.destroy = destroyMock;
        logout(req as Request, res as Response);
        expect(req.session!.destroy).toHaveBeenCalled();
        expect(res.redirect).toHaveBeenCalledWith('/backoffice');
    });

    it("should handle session destruction failure", () => {
        (req.session!.destroy as jest.Mock).mockImplementationOnce((callback) => callback(new Error("Destroy error")));
        logout(req as Request, res as Response);
        expect(logger.info).toHaveBeenCalledWith(expect.stringContaining("Logout Failed!"));
        expect(res.send).toHaveBeenCalledWith("Failed to destroy session");
    });

})
