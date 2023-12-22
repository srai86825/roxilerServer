import express from 'express';
import { fetchTransactions } from '../controllers/transactions.js';
const router=express.Router();

router.get("/",fetchTransactions);


export default router;