import express from "express";
import {
  google,
  signIn,
  signOut,
  signUp,
} from "../controllers/auth.controller.js";
import {
  isValid,
  signInValidator,
  userValidator,
} from "../middlewares/validator.js";

const router = express.Router();

router.post("/sign-up", userValidator, isValid, signUp);
router.post("/sign-in", signInValidator, isValid, signIn);
router.post("/google", google);
router.get("/signout", signOut);

export default router;
