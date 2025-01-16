import fs from 'fs'
import { Request, Response, NextFunction } from 'express-serve-static-core'
import multer from 'multer'
import path from 'path'

const storage = multer.diskStorage({
    destination: (_, file, cb) => {
        let directory = path.resolve(__dirname, '..', 'public', 'img');

        if (file.fieldname == 'user-image') {
            directory = path.resolve(__dirname, '..', 'public', 'img', 'users');
        } else if (file.fieldname == 'book-image') {
            directory = path.resolve(__dirname, '..', 'public', 'img', 'books');
        }

        fs.mkdir(directory, { recursive: true }, (err) => {
            cb(err, directory);
        });

    },
    filename: (_, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`)
    }
})

const upload = multer({ storage })


export const uploadImage = (fieldName: string) => {
    return (req: Request, res: Response, next: NextFunction): void => {
        upload.single(fieldName)(req, res, (err) => {
            if (err) {
                next(err);
            } else {
                next();
            }
        });
    }
};