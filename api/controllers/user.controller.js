import ListingItem from "../models/listingItem.model.js";
import User from "../models/user.model.js";
import { errorHandler } from "../utils/error.js";
import bcrypt from "bcrypt";

export const updateUser = async (req, res, next) => {
  if (req.user.id !== req.params.id)
    return next(errorHandler(401, "You can only update your own profile!"));

  try {
    if (req.body.password) {
      req.body.password = await bcrypt.hash(req.body.password, 10);
    }

    const updateUser = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    const { password, ...rest } = updateUser._doc;

    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  const id = req.params.id;

  if (req.user.id !== id) {
    return next(errorHandler(401, "You can only delete your own account!"));
  }

  try {
    await User.findByIdAndDelete(id);

    res
      .clearCookie("access_token")
      .status(200)
      .json({ message: "Account deleted successfully!" });
  } catch (error) {
    next(error);
  }
};

export const getUserListings = async (req, res, next) => {
  try {
    const id = req.params.id;

    if (req.user.id !== id) {
      return next(
        errorHandler(401, "Authorize yourself to access your listings!")
      );
    }

    const listings = await ListingItem.find({ userRef: id }).sort({
      createdAt: "desc",
    });

    res.status(200).json(listings);
  } catch (error) {
    next(error);
  }
};

export const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return next(errorHandler(404, "User not found!"));

    const { password: pass, ...rest } = user._doc;

    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};
