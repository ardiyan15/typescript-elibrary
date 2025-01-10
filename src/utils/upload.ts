import { Request, Response, NextFunction } from 'express-serve-static-core'
import multer from 'multer'
import path from 'path'

const storage = multer.diskStorage({
    destination: (_, _file, cb) => {
        cb(null, path.join(__dirname, '../public/img/users'))
    },
    filename: (_, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`)
    }
})

const upload = multer({ storage })


export const uploadImage = (req: Request, res: Response, next: NextFunction): void => {
    upload.single("user-image")(req, res, (err) => {
        if (err) {
            next(err);
        } else {
            next();
        }
    });
};