import { Router } from 'express'

import userApiRoutes from "@routes/api/user";
import transactionRoutes from "@routes/api/order"

const router = Router()

router.use('/', userApiRoutes)
router.use('/', transactionRoutes)

export default router