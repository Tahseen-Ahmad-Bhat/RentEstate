import { notify } from "./Notification";

const nameRegex = /^([a-zA-Z ]){2,30}$/;
const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

export const validateName = (name) => {
  return nameRegex.test(name.trim());
};

export const validateEmail = (email) => {
  return emailRegex.test(email.trim());
};

export const validatePassword = (password) => {
  return !!password.trim();
};
