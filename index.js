import express from 'express'

import connectDB from "./src/connection.js";
import env from "dotenv";
import helmet from "helmet";
import cors from "cors";
import adminRoute from "./src/routes/adminRoute.js";
import userRoute from "./src/routes/userRoute.js";
import interestRoute from './src/routes/interestRoute.js'
const app = express();
app.use(express.json());

env.config();
connectDB();

app.use(helmet());
app.use(cors());

app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use("/api/v1/admin",adminRoute);
app.use("/api/v1/user", userRoute);
app.use('/api/v1/interest',interestRoute);
const PORT = process.env.PORT || 8080;

app.listen(PORT, (err) => {
  if (err) {
    console.log("error in index file " + err);
  } else {
    console.log(`listening to the port no. ${PORT}`);
  }
});
