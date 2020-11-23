import * as yup from "yup";

const username = yup
  .string()
  .required("Username is required.")
  .min(5, "Username should have at least 5 characters.")
  .max(20, "Username should have at most 20 characters.")
  .matches(/^\w+$/, "Should be Alphanumeric.");

const firstName = yup
  .string()
  .required("First Name is required.")
  .min(3, "First name should have at least 3 characters.");

const lastName = yup
  .string()
  .required("Last Name is required.")
  .min(3, "First name should have at least 3 characters.");

const email = yup
  .string()
  .required("Email is required.")
  .email("Email is invalid.");

const password = yup
  .string()
  .required("Password is required.")
  .min(5, "Password should have at least 5 characters")
  .max(10, "Password should have at most 10 characters");

export const UserRegistrationRules = yup
  .object()
  .shape({ username, firstName, lastName, password, email });

export const UserAuthenticationRules = yup
  .object()
  .shape({ username, password });
