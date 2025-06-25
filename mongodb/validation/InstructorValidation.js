import Joi from "joi";

// Base validation schema for instructor
export const instructorValidationSchema = Joi.object({
  firstName: Joi.string().min(2).max(50).required().messages({
    "string.min": "First name must be at least 2 characters long",
    "string.max": "First name cannot exceed 50 characters",
    "any.required": "First name is required",
  }),

  lastName: Joi.string().min(2).max(50).required().messages({
    "string.min": "Last name must be at least 2 characters long",
    "string.max": "Last name cannot exceed 50 characters",
    "any.required": "Last name is required",
  }),

  email: Joi.string().email().required().messages({
    "string.email": "Please provide a valid email address",
    "any.required": "Email is required",
  }),

  password: Joi.string()
    .pattern(new RegExp("^[a-zA-Z0-9]{6,30}$"))
    .required()
    .messages({
      "string.pattern.base":
        "Password must be 6-30 characters long and contain only letters and numbers",
      "any.required": "Password is required",
    }),

  department: Joi.string().min(2).max(100).required().messages({
    "string.min": "Department name must be at least 2 characters long",
    "string.max": "Department name cannot exceed 100 characters",
    "any.required": "Department is required",
  }),

  expertise: Joi.array().items(Joi.string().min(2).max(50)).min(1).messages({
    "array.min": "At least one area of expertise is required",
    "string.min": "Each expertise must be at least 2 characters long",
    "string.max": "Each expertise cannot exceed 50 characters",
  }),

  qualification: Joi.string().min(2).max(100).required().messages({
    "string.min": "Qualification must be at least 2 characters long",
    "string.max": "Qualification cannot exceed 100 characters",
    "any.required": "Qualification is required",
  }),

  yearsOfExperience: Joi.number().min(0).max(50).required().messages({
    "number.min": "Years of experience cannot be negative",
    "number.max": "Years of experience cannot exceed 50",
    "any.required": "Years of experience is required",
  }),

  contactNumber: Joi.string()
    .pattern(/^[0-9+\-\s]{10,15}$/)
    .allow("")
    .messages({
      "string.pattern.base": "Please provide a valid contact number",
    }),

  isActive: Joi.boolean().default(true),

  profileImage: Joi.string().uri().allow(null, "").messages({
    "string.uri": "Profile image must be a valid URL",
  }),

  officeHours: Joi.array().items(
    Joi.object({
      day: Joi.string()
        .valid(
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday"
        )
        .required(),
      startTime: Joi.string()
        .pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
        .required()
        .messages({
          "string.pattern.base": "Start time must be in HH:MM format",
        }),
      endTime: Joi.string()
        .pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
        .required()
        .messages({
          "string.pattern.base": "End time must be in HH:MM format",
        }),
    })
  ),
}).options({ abortEarly: false });

// Validation schema for updating instructor (all fields optional)
export const updateInstructorValidationSchema = instructorValidationSchema.fork(
  Object.keys(instructorValidationSchema.describe().keys),
  (schema) => schema.optional()
);
