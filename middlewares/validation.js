const { Joi, celebrate, Segments } = require('celebrate');

module.exports.validateSignup = celebrate({
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
    avatar: Joi.string().required().pattern(/^https?:\/\/\S+$/),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(6),
  }),
});

module.exports.validateSignin = celebrate({
  [Segments.BODY]: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

module.exports.validateUserId = celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    id: Joi.string().hex().length(24),
  }),
});

module.exports.validateUserUpdate = celebrate({
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }),
});

module.exports.validateAvatarUpdate = celebrate({
  [Segments.BODY]: Joi.object().keys({
    avatar: Joi.string().required().pattern(/^https?:\/\/\S+$/),
  }),
});

module.exports.validateCard = celebrate({
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().required(),
    link: Joi.string().required().pattern(/^https?:\/\/\S+$/),
  }),
});

module.exports.validateCardId = celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    cardId: Joi.string().hex().length(24),
  }),
});
