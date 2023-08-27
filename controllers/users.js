const validationError = require('mongoose').Error.ValidationError;
const User = require('../models/user');
const BadRequest = require('../errors/BadRequest');

module.exports.getUsers = (req, res) => User.find({})
  .then((users) => res.status(200).send({ data: users }))
  .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));

module.exports.getUserById = (req, res) => {
  const { id } = req.params;
  return User.findById(id)
    .then((user) => res.status(200).send({ data: user }))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
};

module.exports.createUser = (req, res, next) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar }, { runValidators: true })
    .then((user) => res.status(201).send({ data: user }))
    .catch((err) => {
      if (err instanceof validationError) {
        next(new BadRequest('Переданы некорректные данные'));
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
        next(new BadRequest('Переданы некорректные данные'));
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
        next(new BadRequest('Переданы некорректные данные'));
      } else {
        next(err);
      }
    });
};
