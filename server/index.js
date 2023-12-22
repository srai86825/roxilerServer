import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import helmet from "helmet";
import morgan from "morgan";

//configuring middlewares
dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

import initializationRoutes from "./routes/initialize.js";
import transactionsRoutes from "./routes/transactions.js";
import statisticsRoutes from "./routes/statistics.js";
import chartsRoutes from "./routes/charts.js";
import combinedDataRoutes from "./routes/combinedData.js"; 

//defining Routes
app.use("/api/v1/initialize-database",initializationRoutes);
app.use("/api/v1/transactions",transactionsRoutes);
app.use("/api/v1/statistics",statisticsRoutes);
app.use("/api/v1/charts",chartsRoutes);
app.use("/api/v1/combined-data",combinedDataRoutes);


//starting server
const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    app.listen(process.env.PORT || 3000, () =>
      console.log(`Server started at ${process.env.PORT || 3000} with mongodb`)
    );
  } catch (err) {
    console.log(err);
  }
};
startServer();
