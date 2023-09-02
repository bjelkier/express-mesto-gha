module.exports = (err, req, res) => {
  if (err.statusCode) {
    res.status(err.statusCode).send({ message: err.message });
  } else if (err.name === 'ValidationError') {
    res.status(400).send({ message: 'Ошибка при валидации' });
  } else if (err.name === 'CastError') {
    res.status(400).send({ message: 'Некорректный формат данных' });
  } else if (err.name === 'MongoError' && err.code === 11000) {
    res.status(409).send({ message: 'Пользователь с таким email уже существует' });
  } else if (err.name === 'JsonWebTokenError') {
    res.status(401).send({ message: 'Некорректный токен' });
  } else {
    res.status(500).send({ message: 'Внутренняя ошибка сервера' });
  }
};
