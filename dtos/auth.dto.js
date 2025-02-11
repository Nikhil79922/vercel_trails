const Joi = require('joi');

const signUpDto = Joi.object({
  name: Joi.string().min(3).max(15).required(),
  email: Joi.string().email().required(),
  role: Joi.string().valid('ROLE_USER', 'ROLE_ADMIN').default('ROLE_USER'),
  password: Joi.string()
    .min(8)
    .max(20)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
    .required()
    .messages({ "string.pattern.base": "Password must contain at least 1 uppercase, 1 lowercase, 1 number, and 1 special character." }),
});

const loginDto = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).max(20).required(),
});

const resetPasswordDto = Joi.object({
  password: Joi.string()
    .min(8)
    .max(20)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
    .required()
    .messages({ "string.pattern.base": "Password must contain at least 1 uppercase, 1 lowercase, 1 number, and 1 special character." }),
});

module.exports = { signUpDto, loginDto, resetPasswordDto };
