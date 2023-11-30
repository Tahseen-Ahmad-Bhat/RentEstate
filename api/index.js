import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
const PORT = process.env.PORT || 3000;

import userRouter from "./routes/user.routes.js";
import authRouter from "./routes/auth.routes.js";

const app = express();
app.use(express.json());

app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);

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
