import { check, validationResult } from "express-validator";

export const userValidator = [
  check("username").trim().not().isEmpty().withMessage("Name is missing!"),
  check("email")
    .normalizeEmail({ gmail_remove_dots: false })
    .isEmail()
    .withMessage("Email is invalid!"),
  check("password")
    .trim()
    .not()
    .isEmpty()
    .withMessage("Password is missing!")
    .isLength({ min: 5, max: 15 })
    .withMessage("Password has to be 5 to 15 characters long!"),
];

export const validatePassword = [
  check("newPassword")
    .trim()
    .not()
    .isEmpty()
    .withMessage("Password is missing!")
    .isLength({ min: 5, max: 15 })
    .withMessage("Password has to be 5 to 15 characters long!"),
];

export const signInValidator = [
  check("email")
    .normalizeEmail({ gmail_remove_dots: false })
    .isEmail()
    .withMessage("Email is invalid!"),
  check("password").trim().not().isEmpty().withMessage("Password is missing!"),
];

export const isValid = (req, res, next) => {
  const errors = validationResult(req).array();
  if (errors.length) {
    const error = {
      message: errors[0].msg,
    };
    next(error);
  }

  next();
};
