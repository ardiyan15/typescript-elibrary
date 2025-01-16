import { validationResult } from "express-validator";

import { Request } from "express";
import { UserResult } from '../customTypes/user'
import profileRepository from "@repositories/profileRepository";

class ProfileService {
    async updateUser(req: Request): Promise<[number] | UserResult> {
        const errors = validationResult(req)

        let results: UserResult

        if (!errors.isEmpty()) {
            results = {
                isError: true,
                errors: errors.array()
            }
            return results
        }

        if(req.file) {
            const image = req.file.filename
            req.body.image = image
        }

        const userId = req.body.id
        delete req.body.id
        return profileRepository.update(userId, req.body)
    }
}

export default new ProfileService()