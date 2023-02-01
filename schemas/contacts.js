const Joi = require("joi");

const addContactSchema = Joi.object({
    name: Joi.string().alphanum().min(3).required(),
    email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
  phone: Joi.string().min(3).required(),
    favorite: Joi.boolean(),
});

const updateContactSchema = Joi.object({
    name: Joi.string().alphanum().min(3).required(),
    email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
    phone: Joi.string().min(3).required(),
   favorite: Joi.boolean().required(),
});

const updateContactFavouriteStatusSchema = Joi.object({
  favorite: Joi.boolean().required(),
});

module.exports = {
  addContactSchema,
  updateContactSchema,
  updateContactFavouriteStatusSchema
};