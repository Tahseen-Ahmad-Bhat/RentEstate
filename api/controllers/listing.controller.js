import ListingItem from "../models/listingItem.model.js";

export const createListingItem = async (req, res, next) => {
  try {
    const listingItem = await ListingItem.create(req.body);
    res.status(201).json(listingItem);
  } catch (error) {
    next(error);
  }
};
