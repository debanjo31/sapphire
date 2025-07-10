import Joi from "joi";

// Store creation validation
const storeValidationSchema = Joi.object({
  name: Joi.string().required().trim().min(2).max(100).messages({
    "string.empty": "Store name is required",
    "string.min": "Store name must be at least 2 characters",
    "string.max": "Store name cannot exceed 100 characters",
  }),

  address: Joi.string().required().trim().min(5).max(255).messages({
    "string.empty": "Store address is required",
    "string.min": "Store address must be at least 5 characters",
    "string.max": "Store address cannot exceed 255 characters",
  }),

  managerId: Joi.number().integer().positive().optional().messages({
    "number.base": "Manager ID must be a number",
    "number.integer": "Manager ID must be an integer",
    "number.positive": "Manager ID must be positive",
  }),
});

// Store update validation
const storeUpdateValidationSchema = Joi.object({
  name: Joi.string().trim().min(2).max(100).optional().messages({
    "string.min": "Store name must be at least 2 characters",
    "string.max": "Store name cannot exceed 100 characters",
  }),

  address: Joi.string().trim().min(5).max(255).optional().messages({
    "string.min": "Store address must be at least 5 characters",
    "string.max": "Store address cannot exceed 255 characters",
  }),

  managerId: Joi.number().integer().positive().optional().allow(null).messages({
    "number.base": "Manager ID must be a number",
    "number.integer": "Manager ID must be an integer",
    "number.positive": "Manager ID must be positive",
  }),
});

// Manager assignment validation
const managerAssignmentSchema = Joi.object({
  managerId: Joi.number().integer().positive().required().messages({
    "number.base": "Manager ID must be a number",
    "number.integer": "Manager ID must be an integer",
    "number.positive": "Manager ID must be positive",
    "any.required": "Manager ID is required",
  }),
});

// Cashier assignment validation
const cashierAssignmentSchema = Joi.object({
  cashierId: Joi.number().integer().positive().required().messages({
    "number.base": "Cashier ID must be a number",
    "number.integer": "Cashier ID must be an integer",
    "number.positive": "Cashier ID must be positive",
    "any.required": "Cashier ID is required",
  }),
});

export const validateStore = (data) => {
  const { error, value } = storeValidationSchema.validate(data, {
    abortEarly: false,
    allowUnknown: true,
  });

  if (error) {
    const errorMessages = error.details.map((detail) => detail.message);
    return { valid: false, errors: errorMessages };
  }
  return { valid: true, value };
};

export const validateStoreUpdate = (data) => {
  const { error, value } = storeUpdateValidationSchema.validate(data, {
    abortEarly: false,
    allowUnknown: true,
  });

  if (error) {
    const errorMessages = error.details.map((detail) => detail.message);
    return { valid: false, errors: errorMessages };
  }
  return { valid: true, value };
};

export const validateManagerAssignment = (data) => {
  const { error, value } = managerAssignmentSchema.validate(data, {
    abortEarly: false,
    allowUnknown: true,
  });

  if (error) {
    const errorMessages = error.details.map((detail) => detail.message);
    return { valid: false, errors: errorMessages };
  }
  return { valid: true, value };
};

export const validateCashierAssignment = (data) => {
  const { error, value } = cashierAssignmentSchema.validate(data, {
    abortEarly: false,
    allowUnknown: true,
  });

  if (error) {
    const errorMessages = error.details.map((detail) => detail.message);
    return { valid: false, errors: errorMessages };
  }
  return { valid: true, value };
};
