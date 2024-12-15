import express from 'express'
import { index, store } from '@controllers/backoffice/language/index'

const router = express.Router()

router.get('/language', index)

router.post('/language', store)

export default router;