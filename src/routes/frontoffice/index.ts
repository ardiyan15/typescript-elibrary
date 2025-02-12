import { Router } from 'express'

import home from "@routes/frontoffice/home/index";
import cart from "@routes/frontoffice/cart/index";

const router = Router()

router.use('/', home)
router.use('/', cart)

export default router