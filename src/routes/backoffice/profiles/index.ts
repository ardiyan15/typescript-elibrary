import express from 'express'
import { edit, index, update } from '@controllers/backoffice/profiles/index'
import { uploadImage } from "@utils/upload";

const router = express.Router()

router.get('/profile', index)

router.get('/profile/form', edit)

router.post('/profile', uploadImage, update)

export default router;