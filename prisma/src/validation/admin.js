import Joi from "joi";

const adminValidationSchema = Joi.object({
  name: Joi.string().required().trim().min(2).max(100).messages({
    "string.empty": "Name is required",
    "string.min": "Name must be at least 2 characters",
    "string.max": "Name cannot exceed 100 characters",
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
