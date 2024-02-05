import ListingItem from "../models/listingItem.model.js";
import { errorHandler } from "../utils/error.js";

export const createListingItem = async (req, res, next) => {
  try {
    const listingItem = await ListingItem.create(req.body);
    res.status(201).json(listingItem);
  } catch (error) {
    next(error);
  }
};

export const deleteListingItem = async (req, res, next) => {
  try {
    const { id } = req.params;

    const itemToBeDeleted = await ListingItem.findById(id);

    if (!itemToBeDeleted) {
      next(errorHandler(404, "Listing item not found!"));
    }

    await ListingItem.deleteOne({ _id: itemToBeDeleted._id });

    res.status(200).json({ message: "Listing item deleted successfully!" });
  } catch (error) {
    next(error);
  }
};
