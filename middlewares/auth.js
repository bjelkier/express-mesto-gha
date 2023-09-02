const jwt = require('jsonwebtoken');

const WRONG_DATA = 401;

// eslint-disable-next-line consistent-return
module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return res.status(WRONG_DATA).send({ message: 'Требуется авторизация' });
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, 'iam-extra-tired');
  } catch (err) {
    return res.status(WRONG_DATA).send({ message: 'Требуется авторизация' });
  }

  req.user = payload;
  next();
};
