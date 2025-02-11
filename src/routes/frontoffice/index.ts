import { Router } from 'express'

import home from "@routes/frontoffice/home/index";

const router = Router()

router.use('/', home)

export default router