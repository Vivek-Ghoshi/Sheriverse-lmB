const Joi = require('joi');
const { Segments } = require('celebrate');

exports.loginInstructorValidation = {
  [Segments.BODY]: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required()
  })
};

exports.createAssignmentValidation = {
  [Segments.BODY]: Joi.object().keys({
    title: Joi.string().min(3).max(100).required(),
    description: Joi.string().min(10).max(1000).required(),
    dueDate: Joi.date().required()
  })
};

exports.updateAssignmentValidation = {
  [Segments.PARAMS]: Joi.object().keys({
    id: Joi.string().hex().length(24).required()
  }),
  [Segments.BODY]: Joi.object().keys({
    title: Joi.string().min(3).max(100).optional(),
    description: Joi.string().min(10).max(1000).optional(),
    dueDate: Joi.date().optional()
  })
};

exports.deleteAssignmentValidation = {
  [Segments.PARAMS]: Joi.object().keys({
    id: Joi.string().hex().length(24).required()
  })
};

exports.getAssignmentSubmissionsValidation = {
  [Segments.PARAMS]: Joi.object().keys({
    id: Joi.string().hex().length(24).required()
  })
};
