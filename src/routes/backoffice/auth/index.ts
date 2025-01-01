import express from 'express'

const router = express.Router()

import { index, login, logout } from '@controllers/backoffice/auth/index'
import { redirectIfAuthenticated } from '@middleware/authMiddleware'

router.get("/", redirectIfAuthenticated, index)

router.post('/login', login)

router.post('/logout', logout)

export default router