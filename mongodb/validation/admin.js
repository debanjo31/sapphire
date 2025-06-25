import Joi from "joi";

const adminValidationSchema = Joi.object({
  firstName: Joi.string().required().trim().min(2).max(50).messages({
    "string.empty": "First name is required",
    "string.min": "First name must be at least 2 characters",
    "string.max": "First name cannot exceed 50 characters",
  }),

  lastName: Joi.string().required().trim().min(2).max(50).messages({
    "string.empty": "Last name is required",
    "string.min": "Last name must be at least 2 characters",
    "string.max": "Last name cannot exceed 50 characters",
  }),

  email: Joi.string().required().email().trim().lowercase().messages({
    "string.email": "Please enter a valid email address",
    "string.empty": "Email is required",
  }),

  password: Joi.string()
    .required()
    .min(8)
    .max(100)
    .pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])"))
    .messages({
      "string.empty": "Password is required",
      "string.min": "Password must be at least 8 characters",
      "string.max": "Password cannot exceed 100 characters",
      "string.pattern.base":
        "Password must contain at least one uppercase letter, one lowercase letter, and one number",
    }),

  created: Joi.date().default(Date.now),
  updated: Joi.date().default(Date.now),
});

export const validateAdmin = (data) => {
  const { error, value } = adminValidationSchema.validate(data, {
    abortEarly: false,
    allowUnknown: true,
  });

  if (error) {
    const errorMessages = error.details.map((detail) => detail.message);
    return { valid: false, errors: errorMessages };
  }
  return { valid: true, value };
};
