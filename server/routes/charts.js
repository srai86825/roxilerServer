import express from 'express';
import { fetchBarChart, fetchPieChart } from '../controllers/charts.js';
const router=express.Router();


router.get('/pieChart',fetchPieChart)
router.get('/barChart',fetchBarChart)

export default router;