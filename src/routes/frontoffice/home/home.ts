import { Router } from 'express'
const router = Router()

import { getHome } from '../../../controllers/frontoffice/home/home';

router.get("/", getHome)

export default router