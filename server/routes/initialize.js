import express from 'express';
import { initializeDatabase } from '../controllers/intialize.js';
const router=express.Router();

//need to make sure that the following route is only accessible to superadmin users only.
//else initializing multiple time will lead to redundancy.
router.get('/', initializeDatabase)

export default router;