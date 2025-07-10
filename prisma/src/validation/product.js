import Joi from "joi";

// Product creation validation
const productValidationSchema = Joi.object({
  name: Joi.string().required().trim().min(2).max(100).messages({
    "string.empty": "Product name is required",
    "string.min": "Product name must be at least 2 characters",
    "string.max": "Product name cannot exceed 100 characters",
  }),

  description: Joi.string().trim().max(500).optional().messages({
    "string.max": "Product description cannot exceed 500 characters",
  }),

  price: Joi.number().positive().precision(2).required().messages({
    "number.base": "Price must be a number",
    "number.positive": "Price must be positive",
    "any.required": "Price is required",
  }),

  stock: Joi.number().integer().min(0).default(0).messages({
    "number.base": "Stock must be a number",
    "number.integer": "Stock must be an integer",
    "number.min": "Stock cannot be negative",
  }),
});

// Product update validation
const productUpdateValidationSchema = Joi.object({
  name: Joi.string().trim().min(2).max(100).optional().messages({
    "string.min": "Product name must be at least 2 characters",
    "string.max": "Product name cannot exceed 100 characters",
  }),

  description: Joi.string().trim().max(500).optional().allow("").messages({
    "string.max": "Product description cannot exceed 500 characters",
  }),

  price: Joi.number().positive().precision(2).optional().messages({
    "number.base": "Price must be a number",
    "number.positive": "Price must be positive",
  }),

  stock: Joi.number().integer().min(0).optional().messages({
    "number.base": "Stock must be a number",
    "number.integer": "Stock must be an integer",
    "number.min": "Stock cannot be negative",
  }),
});

// Stock update validation
const stockUpdateValidationSchema = Joi.object({
  stock: Joi.number().integer().min(0).required().messages({
    "number.base": "Stock must be a number",
    "number.integer": "Stock must be an integer",
    "number.min": "Stock cannot be negative",
    "any.required": "Stock is required",
  }),
});

// Stock adjustment validation
const stockAdjustmentValidationSchema = Joi.object({
  adjustment: Joi.number().integer().not(0).required().messages({
    "number.base": "Adjustment must be a number",
    "number.integer": "Adjustment must be an integer",
    "number.invalid": "Adjustment cannot be zero",
    "any.required": "Adjustment is required",
  }),
});

export const validateProduct = (data) => {
  const { error, value } = productValidationSchema.validate(data, {
    abortEarly: false,
    allowUnknown: true,
  });

  if (error) {
    const errorMessages = error.details.map((detail) => detail.message);
    return { valid: false, errors: errorMessages };
  }
  return { valid: true, value };
};

export const validateProductUpdate = (data) => {
  const { error, value } = productUpdateValidationSchema.validate(data, {
    abortEarly: false,
    allowUnknown: true,
  });

  if (error) {
    const errorMessages = error.details.map((detail) => detail.message);
    return { valid: false, errors: errorMessages };
  }
  return { valid: true, value };
};

export const validateStockUpdate = (data) => {
  const { error, value } = stockUpdateValidationSchema.validate(data, {
    abortEarly: false,
    allowUnknown: true,
  });

  if (error) {
    const errorMessages = error.details.map((detail) => detail.message);
    return { valid: false, errors: errorMessages };
  }
  return { valid: true, value };
};

export const validateStockAdjustment = (data) => {
  const { error, value } = stockAdjustmentValidationSchema.validate(data, {
    abortEarly: false,
    allowUnknown: true,
  });

  if (error) {
    const errorMessages = error.details.map((detail) => detail.message);
    return { valid: false, errors: errorMessages };
  }
  return { valid: true, value };
};
