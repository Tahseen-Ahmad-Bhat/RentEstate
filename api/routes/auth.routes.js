import express from "express";

import {
  google,
  signIn,
  signOut,
  signUp,
} from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/sign-up", signUp);
router.post("/sign-in", signIn);
router.post("/google", google);
router.get("/signout", signOut);

export default router;
