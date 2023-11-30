import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
const PORT = process.env.PORT || 3000;

import userRouter from "./routes/user.routes.js";

const app = express();

app.use("/api/user", userRouter);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to database successfully!");
    app.listen(PORT, () => {
      console.log("Server is running on port " + PORT);
    });
  })
  .catch((err) => {
    console.log(err.message || err);
  });
