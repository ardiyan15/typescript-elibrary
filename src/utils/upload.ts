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

export const uploadImage = upload.single('user-image')