const { Joi, celebrate } = require('celebrate');
const { isURL, isEmail } = require('validator');
const { ObjectId } = require('mongoose').Types;
const BadRequest = require('../errors/BadRequest');

const validateURL = (URL) => {
  if (isURL(URL)) {
    return URL;
  }
  throw new BadRequest(': invalid URL');
};

const validateEmail = (Email) => {
  if (isEmail(Email)) {
    return Email;
  }
  throw new BadRequest(': invalid Email');
};

const validateId = (Id) => {
  if (ObjectId.isValid(Id)) {
    return Id;
  }
  throw new BadRequest(': invalid Id');
};

module.exports.validationUserInfo = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }),
});

module.exports.validationUserAvatar = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().custom(validateURL),
  }),
});

module.exports.validationEmailAndPassword = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().custom(validateEmail),
    password: Joi.string().required().min(6),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().custom(validateURL),
  }),
});

module.exports.validationUserId = celebrate({
  params: Joi.object().keys({
    id: Joi.string().required().custom(validateId),
  }),
});

module.exports.validationCardInfo = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().custom(validateURL),
  }),
});

module.exports.validationCardId = celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().required().custom(validateId),
  }),
});
