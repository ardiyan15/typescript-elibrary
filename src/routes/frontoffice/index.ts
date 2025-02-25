import { Router } from 'express'

import home from "@routes/frontoffice/home/index";
import cart from "@routes/frontoffice/cart/index";
import auth from "@routes/frontoffice/auth/index"

const router = Router()

router.use('/', home)
router.use('/', cart)
router.use('/', auth)

export default router