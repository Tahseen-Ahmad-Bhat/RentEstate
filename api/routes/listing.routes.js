import express from "express";
import {
  createListingItem,
  deleteListingItem,
  getListingItem,
  updateListingItem,
} from "../controllers/listing.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.post("/create", verifyToken, createListingItem);
router.delete("/delete/:id", verifyToken, deleteListingItem);
router.patch("/update/:id", verifyToken, updateListingItem);
router.get("/getListingItem/:id", getListingItem);

export default router;
