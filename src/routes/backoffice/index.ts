import { Router } from 'express'

import backHomeRoutes from "@routes/backoffice/home/home";
import userRoutes from "@routes/backoffice/users/index";
import bookRoutes from "@routes/backoffice/books/index";
import languageRoutes from '@routes/backoffice/language/index'
import profileRoutes from '@routes/backoffice/profiles/index'

const router = Router()

router.use('/', backHomeRoutes)
router.use('/', userRoutes)
router.use('/', bookRoutes)
router.use('/', languageRoutes)
router.use('/', profileRoutes)

export default router