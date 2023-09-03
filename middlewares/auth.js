const jwt = require('jsonwebtoken');
const WrongData = require('../errors/WrongData');

module.exports = (req, res, next) => {
  if (!req.cookies.jwt) {
    next(new WrongData('Требуется авторизация'));
  }
  const token = req.cookies.jwt;
  let payload;
  try {
    payload = jwt.verify(token, 'iam-extra-tired');
  } catch (err) {
    next(new WrongData('Требуется авторизация'));
  }
  req.user = payload;
  next();
};
