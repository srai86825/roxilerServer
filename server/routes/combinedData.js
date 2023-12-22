import express from 'express';
const router=express.Router();

import fetchCombinedData from '../controllers/combinedData.js';

router.get('/all', fetchCombinedData);

export default router;