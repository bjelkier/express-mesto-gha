const jwt = require('jsonwebtoken');
const WrongData = require('../errors/WrongData');

module.exports = (req, res, next) => {
  if (!req.cookies.jwt) {
    next(new WrongData('Требуется авторизация'));
  }
  const token = req.cookies.jwt;
  let payload;
  try {
    payload = jwt.verify(token, 'cde3828a2fde0b2bd42cb6108bcc8a869c8ba947ace460eccabffc67a229604d');
  } catch (err) {
    next(new WrongData('Требуется авторизация'));
  }
  req.user = payload;
  next();
};
