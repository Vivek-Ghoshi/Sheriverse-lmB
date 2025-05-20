const Joi = require('joi');
const { Segments } = require('celebrate');

exports.registerValidation = {
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().min(2).max(50).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required()
  })
};

exports.loginValidation = {
  [Segments.BODY]: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required()
  })
};

exports.enrollCourseValidation = {
  [Segments.PARAMS]: Joi.object().keys({
    id: Joi.string().hex().length(24).required()
  })
};

exports.getCourseByIdValidation = {
  [Segments.PARAMS]: Joi.object().keys({
    id: Joi.string().hex().length(24).required()
  })
};

exports.getCourseContentValidation = {
  [Segments.PARAMS]: Joi.object().keys({
    id: Joi.string().hex().length(24).required()
  })
};

exports.submitAssignmentValidation = {
  [Segments.PARAMS]: Joi.object().keys({
    id: Joi.string().hex().length(24).required()
  }),
  [Segments.BODY]: Joi.object().keys({
    fileUrl: Joi.string().uri().required()
  })
};

exports.editStudentProfileValidation = {
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().min(2).max(50).optional(),
    phone: Joi.string().pattern(/^[0-9]{10}$/).optional(),
    bio: Joi.string().max(300).optional()
  })
  // You don't need to validate `req.file` here; use multer filters for file type check.
};
