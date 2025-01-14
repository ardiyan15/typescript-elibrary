import { validationResult } from "express-validator";

import { Request } from "express";
import { UserResult } from '../types/user'
import profileRepository from "@repositories/profileRepository";

class ProfileService {
    async updateUser(req: Request): Promise<[number] | UserResult> {
        const errors = validationResult(req)

        let results: UserResult

        console.log(errors)
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
        console.log(req.body)

        const userId = req.body.id
        delete req.body.id
        return profileRepository.update(userId, req.body)
    }
}

export default new ProfileService()