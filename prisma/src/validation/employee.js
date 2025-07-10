import Joi from "joi";

// Manager creation validation
const managerValidationSchema = Joi.object({
  userId: Joi.number().integer().positive().required().messages({
    "number.base": "User ID must be a number",
    "number.integer": "User ID must be an integer",
    "number.positive": "User ID must be positive",
    "any.required": "User ID is required",
  }),

  address: Joi.string().trim().min(5).max(255).optional().messages({
    "string.min": "Address must be at least 5 characters",
    "string.max": "Address cannot exceed 255 characters",
  }),

  phone: Joi.string()
    .trim()
    .pattern(/^\+?[\d\s\-\(\)]+$/)
    .min(10)
    .max(15)
    .optional()
    .messages({
      "string.pattern.base": "Phone number format is invalid",
      "string.min": "Phone number must be at least 10 characters",
      "string.max": "Phone number cannot exceed 15 characters",
    }),

  nin: Joi.string().trim().min(8).max(20).optional().messages({
    "string.min": "NIN must be at least 8 characters",
    "string.max": "NIN cannot exceed 20 characters",
  }),
});

// Cashier creation validation
const cashierValidationSchema = Joi.object({
  userId: Joi.number().integer().positive().required().messages({
    "number.base": "User ID must be a number",
    "number.integer": "User ID must be an integer",
    "number.positive": "User ID must be positive",
    "any.required": "User ID is required",
  }),

  address: Joi.string().trim().min(5).max(255).optional().messages({
    "string.min": "Address must be at least 5 characters",
    "string.max": "Address cannot exceed 255 characters",
  }),

  phone: Joi.string()
    .trim()
    .pattern(/^\+?[\d\s\-\(\)]+$/)
    .min(10)
    .max(15)
    .optional()
    .messages({
      "string.pattern.base": "Phone number format is invalid",
      "string.min": "Phone number must be at least 10 characters",
      "string.max": "Phone number cannot exceed 15 characters",
    }),

  nin: Joi.string().trim().min(8).max(20).optional().messages({
    "string.min": "NIN must be at least 8 characters",
    "string.max": "NIN cannot exceed 20 characters",
  }),

  storeid: Joi.number().integer().positive().optional().messages({
    "number.base": "Store ID must be a number",
    "number.integer": "Store ID must be an integer",
    "number.positive": "Store ID must be positive",
  }),
});

export const validateManager = (data) => {
  const { error, value } = managerValidationSchema.validate(data, {
    abortEarly: false,
    allowUnknown: true,
  });

  if (error) {
    const errorMessages = error.details.map((detail) => detail.message);
    return { valid: false, errors: errorMessages };
  }
  return { valid: true, value };
};

export const validateCashier = (data) => {
  const { error, value } = cashierValidationSchema.validate(data, {
    abortEarly: false,
    allowUnknown: true,
  });

  if (error) {
    const errorMessages = error.details.map((detail) => detail.message);
    return { valid: false, errors: errorMessages };
  }
  return { valid: true, value };
};
