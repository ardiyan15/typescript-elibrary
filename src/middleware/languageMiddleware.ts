import { Request, Response, NextFunction } from "express";
import { redisClient } from '@utils/redis'

const languageMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const result = await redisClient.get('language')
    let language = 'en'

    if (result) {
        const languageSetting = JSON.parse(result)
        language = languageSetting.language
    }

    res.cookie('i18next', language)
    res.locals.translate = req.t;
    next();
}

export default languageMiddleware