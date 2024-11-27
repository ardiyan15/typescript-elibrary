import fs from 'fs'
import multer from "multer"
import csv from 'csv-parser'
import bcrypt from 'bcrypt'

import { IUser } from "@models/backoffice/users/user";

const upload = multer({
    dest: 'uploads/'
})

upload.single('file')

interface Results {
    users: object[]
}

export const importUser = (filePath: string): Promise<Results> => {
    return new Promise((resolve, reject) => {
        const results: Results = {
            "users": []
        }

        const dataPromises: Promise<void>[] = []

        fs.createReadStream(filePath)
            .pipe(csv({ separator: ';' }))
            .on('data', (data: IUser) => {
                const dataPromise = bcrypt.hash(data.password, 10).then((encryptedPassword) => {
                    const modifiedData: IUser = {
                        ...data,
                        password: encryptedPassword
                    }

                    results.users.push(modifiedData)
                }).catch((err) => console.error("Error Encrypting Password", err))

                dataPromises.push(dataPromise)
            })
            .on('end', () => {
                Promise.all(dataPromises)
                    .then(() => {
                        fs.unlinkSync(filePath)
                        resolve(results)
                    }).catch(reject)
            })
            .on('error', error => {
                fs.unlinkSync(filePath)
                reject(error)
            })
    })
}