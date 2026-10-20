import { Request } from "express"

export const regenerateSession = (req: Request): Promise<void> => {
    return new Promise((resolve, reject) => {
        req.session.regenerate((err) => {
            if(err) {
                return reject(err)
            }

            resolve()
        })
    })
}

export const saveSession = (req: Request): Promise<void> => {
    return new Promise((resolve, reject) => {
        req.session.save((err) => {
            if(err) {
                return reject(err)
            }

            resolve()
        })
    })
}