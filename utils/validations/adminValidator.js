const Joi = require('joi');
const { Segments } = require('celebrate');

exports.createAdminValidation = {
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().min(3).max(50).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
  })
};

exports.adminLoginValidation = {
  [Segments.BODY]: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required()
  })
};

exports.createCourseValidation = {
  [Segments.BODY]: Joi.object().keys({
    title: Joi.string().min(3).max(100).required(),
    description: Joi.string().min(10).max(1000).required(),
    instructor: Joi.string().required(),
    price: Joi.number().min(0).required(),
    duration: Joi.string().required()
  })
};

exports.deleteCourseValidation = {
  [Segments.PARAMS]: Joi.object().keys({
    id: Joi.string().hex().length(24).required()
  })
};

exports.createInstructorValidation = {
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().min(3).max(50).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    experience: Joi.number().min(0).required(),
    specialization: Joi.string().required()
  })
};

exports.removeInstructorValidation = {
  [Segments.PARAMS]: Joi.object().keys({
    id: Joi.string().hex().length(24).required()
  })
};

exports.uploadContentValidation = {
  [Segments.BODY]: Joi.object().keys({
    titles: Joi.array().items(Joi.string().min(3).required()).required(),
    descriptions: Joi.array().items(Joi.string().min(10).required()).required(),
    orders: Joi.array().items(Joi.number().min(1).required()).required()
  }),
  [Segments.PARAMS]: Joi.object().keys({
    id: Joi.string().hex().length(24).required()
  })
};
