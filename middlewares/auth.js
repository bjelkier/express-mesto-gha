const jwt = require('jsonwebtoken');
const Unauthorized = require('../utils/Unauthorized');

module.exports = (req, res, next) => {
  if (!req.cookies.jwt) {
    next(new Unauthorized('Требуется авторизация'));
  }
  const token = req.cookies.jwt;
  let payload;
  try {
    payload = jwt.verify(token, 'iam-extra-tired');
  } catch (err) {
    next(new Unauthorized('Требуется авторизация'));
  }
  req.user = payload;
  next();
};
