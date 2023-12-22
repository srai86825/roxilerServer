import express from 'express';

import { fetchStatistics } from '../controllers/statistics.js';



const router=express.Router();

router.get("/",fetchStatistics);

export default router;