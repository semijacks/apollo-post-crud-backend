import * as yup from "yup";

const title = yup
  .string()
  .required("Post title is required.")
  .min(3, "Title should have at least 3 characters.")
  .max(100, "Title should have a maximum of 100 characters.");

const content = yup
  .string()
  .required("Post content is required.")
  .min(10, "Content should have at least 10 characters.")
  .max(3000, "Content should have at most 3000 characters.");

export const newPostValidationRules = yup.object().shape({
  title,
  content,
});

export const editPostValidationRules = yup.object().shape({
  title,
  content,
});
