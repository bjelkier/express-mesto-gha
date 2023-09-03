const {
  INTERNAL_SERVER_ERROR, BAD_REQUEST, UNAUTHORIZED, NOT_FOUND, CONFLICT,
} = require('../utils/constants');

module.exports.errorHandler = (err, req, res) => {
  if (err.name === 'ValidationError') {
    return res.status(BAD_REQUEST).send({ message: 'Ошибка при валидации' });
  } if (err.name === 'CastError') {
    return res.status(BAD_REQUEST).send({ message: 'Передан некорректный id' });
  } if (err.code === 11000) {
    return res.status(CONFLICT).send({ message: 'Пользователь с таким email уже существует' });
  } if (err.name === 'UnauthorizedError') {
    return res.status(UNAUTHORIZED).send({ message: 'Неправильные почта или пароль' });
  } if (err.name === 'NotFound') {
    return res.status(NOT_FOUND).send({ message: 'Ресурс не найден' });
  }
  return res.status(INTERNAL_SERVER_ERROR).send({ message: 'Внутренняя ошибка сервера' });
};
