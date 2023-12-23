import express from "express";
import { testUser, updateUser } from "../controllers/user.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.get("/test", testUser);
router.post("/update/:id", verifyToken, updateUser);

export default router;
