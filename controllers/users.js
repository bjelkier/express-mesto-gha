const validationError = require('mongoose').Error.ValidationError;
const castError = require('mongoose').Error.CastError;
const BadRequest = require('../errors/BadRequest');
const NotFound = require('../errors/NotFound');
const User = require('../models/user');

module.exports.getUsers = (req, res) => User.find({})
  .then((users) => res.status(200).send({ data: users }))
  .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));

module.exports.getUserById = (req, res, next) => {
  const { id } = req.params;
  return User.findById(id)
    .then(((user) => {
      if (user) {
        res.send({ data: user });
      } else {
        next(new NotFound(`Пользователь по указанному id: ${req.params.id} не найден`));
      }
    }))
    .catch((err) => {
      if (err instanceof castError) {
        next(new BadRequest('Передан некорректный id'));
      } else {
        next(err);
      }
    });
};

module.exports.createUser = (req, res, next) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.status(201).send({ data: user }))
    .catch((err) => {
      if (err instanceof validationError) {
        next(new BadRequest('Некорректный id карточки'));
      } else {
        next(err);
      }
    });
};

module.exports.updateUser = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .then(((user) => res.send({ data: user })))
    .catch((err) => {
      if (err instanceof validationError) {
        next(new BadRequest('Некорректные данные'));
      } else {
        next(err);
      }
    });
};

module.exports.updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .then(((user) => res.send({ data: user })))
    .catch((err) => {
      if (err instanceof validationError) {
        next(new BadRequest('Некорректные данные'));
      } else {
        next(err);
      }
    });
};
