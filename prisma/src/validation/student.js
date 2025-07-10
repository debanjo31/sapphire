import Joi from "joi";

 const studentSchema =  Joi.object({
    firstName: Joi.string().min(2).required(),
    lastName: Joi.string().min(2).required(),
    age: Joi.number().min(16).max(70).required(),
    email: Joi.string().email().required(),
    password: Joi.string()
      .pattern(new RegExp("^[a-zA-Z0-9]{6,12}$"))
      .required(),
    virtual: Joi.boolean().default(false),
    gender: Joi.string().valid("male", "female"),
  }).options({ abortEarly: false }); // This makes Joi validate all fields before returning errors


  export const validateStudent = (data) => {
    const { error, value } = studentSchema.validate(data);
    if (error) {
      const errorMessages = error.details.map((detail) => detail.message);
      return { valid: false, errors: errorMessages };
    }
    return { valid: true, value };
  } 