import Joi from "joi";

// Course validation schema
export const courseValidationSchema = Joi.object({
  title: Joi.string().min(3).max(100).required().trim().messages({
    "string.min": "Title must be at least 3 characters long",
    "string.max": "Title cannot exceed 100 characters",
    "any.required": "Title is required",
  }),

  description: Joi.string().min(10).max(1000).required().trim().messages({
    "string.min": "Description must be at least 10 characters long",
    "string.max": "Description cannot exceed 1000 characters",
    "any.required": "Description is required",
  }),

  weeks: Joi.number().integer().min(1).required().messages({
    "number.base": "Weeks must be a number",
    "number.integer": "Weeks must be a whole number",
    "number.min": "Weeks must be at least 1",
    "any.required": "Weeks is required",
  }),

  level: Joi.string()
    .valid("beginner", "intermediate", "advanced")
    .required()
    .messages({
      "any.only": "Level must be either beginner, intermediate, or advanced",
      "any.required": "Level is required",
    }),
}).options({ abortEarly: false });

// Update course validation schema (all fields optional)
export const updateCourseValidationSchema = courseValidationSchema.fork(
  Object.keys(courseValidationSchema.describe().keys),
  (schema) => schema.optional()
);
