
import Joi from 'joi';

export const registrationSchema = Joi.object({
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  confirmPassword: Joi.string().valid(Joi.ref('password')).required().messages({
    'any.only': '{{#label}} does not match password',
  }),
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

export const eventSchema = Joi.object({
  name: Joi.string().required(),
  venue: Joi.string().required(),
  date: Joi.string().required(),
  time: Joi.string().required(),
  description: Joi.string().required(),
  mapLink: Joi.string().uri().allow('').optional(),
  ticketLink: Joi.string().uri().allow('').optional(),
  imageUrl: Joi.string().uri().allow('').optional(),
  userId: Joi.string().required(),
  contacts: Joi.array().items(Joi.string().pattern(/^\d+$/)).min(1).required(), // Array of strings, at least one, numbers only
});

export const profileUpdateSchema = Joi.object({
  firstName: Joi.string().optional(),
  lastName: Joi.string().optional(),
  email: Joi.string().email().optional(),
});

export const passwordChangeSchema = Joi.object({
  currentPassword: Joi.string().required(),
  newPassword: Joi.string().min(6).required(),
  confirmNewPassword: Joi.string().valid(Joi.ref('newPassword')).required().messages({
    'any.only': '{{#label}} does not match new password',
  }),
});
