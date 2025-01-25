import { Router } from 'express'

import userApiRoutes from "@routes/api/user";
import transactionRoutes from "@routes/api/transaction"

const router = Router()

router.use('/', userApiRoutes)
router.use('/', transactionRoutes)

export default router