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

    // console.log(req.user);

    if (!itemToBeDeleted) {
      next(errorHandler(404, "Listing item not found!"));
      return;
    }

    if (req.user.id !== itemToBeDeleted.userRef) {
      next(errorHandler(401, "You can only delete your own items!"));
      return;
    }

    await ListingItem.deleteOne({ _id: itemToBeDeleted._id });

    res.status(200).json({ message: "Listing item deleted successfully!" });
  } catch (error) {
    next(error);
  }
};

export const updateListingItem = async (req, res, next) => {
  const { id } = req.params;

  try {
    const itemToBeUpdated = await ListingItem.findById(id);

    if (!itemToBeUpdated) {
      next(errorHandler(404, "Listing item not found!"));
      return;
    }

    if (itemToBeUpdated.userRef !== req.user.id) {
      next(errorHandler(401, "You can only update your own listing-items!"));
      return;
    }

    const updatedListingItem = await ListingItem.findByIdAndUpdate(
      id,
      req.body,
      { new: true }
    );

    res.status(200).json({
      message: "Listing item updated successfully!",
      updatedListingItem,
    });
  } catch (error) {
    next(error);
  }
};

export const getListingItem = async (req, res, next) => {
  try {
    const { id } = req.params;
    const listingItem = await ListingItem.findById(id);

    if (!listingItem) return next(errorHandler(404, "Listing item not found!"));

    res.status(200).json(listingItem);
  } catch (error) {
    next(error);
  }
};
