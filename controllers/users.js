const bcrypt = require('bcryptjs');

const jwt = require('jsonwebtoken');

const validationError = require('mongoose').Error.ValidationError;
const castError = require('mongoose').Error.CastError;
const User = require('../models/user');

const INTERNAL_SERVER_ERROR = 500;
const BAD_REQUEST = 400;
const NOT_FOUND = 404;
const WRONG_DATA = 401;

module.exports.getUsers = (req, res) => User.find({})
  .then((users) => res.status(200).send({ data: users }))
  .catch(() => res.status(INTERNAL_SERVER_ERROR).send({ message: 'Внутренняя ошибка сервера' }));

module.exports.getUserById = (req, res) => {
  const { id } = req.params;
  User.findById(id)
    .then((user) => {
      if (!user) {
        res.status(NOT_FOUND).send({ message: 'Пользователь с таким id не найден' });
      } else {
        res.status(200).send(user);
      }
    })
    .catch((err) => {
      if (err instanceof castError) {
        res.status(BAD_REQUEST).send({ message: 'Передан некорректный id' });
      } else {
        res.status(INTERNAL_SERVER_ERROR).send({ message: 'Внутренняя ошибка сервера' });
      }
    });
};

module.exports.createUser = (req, res) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hashedPassword) => {
      User.create({
        name, about, avatar, email, password: hashedPassword,
      })
        .then((user) => res.status(201).send({ data: user }))
        .catch((err) => {
          if (err instanceof validationError || err instanceof castError) {
            res.status(BAD_REQUEST).send({ message: 'Ошибка при валидации' });
          } else {
            res.status(INTERNAL_SERVER_ERROR).send({ message: 'Внутренняя ошибка сервера' });
          }
        });
    })
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
};

module.exports.updateUser = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .then(((user) => res.status(200).send({ data: user })))
    .catch((err) => {
      if (err instanceof validationError) {
        res.status(BAD_REQUEST).send({ message: 'Ошибка при валидации' });
      } else {
        res.status(INTERNAL_SERVER_ERROR).send({ message: 'Внутренняя ошибка сервера' });
      }
    });
};

module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .then(((user) => res.status(200).send({ data: user })))
    .catch((err) => {
      if (err instanceof validationError) {
        res.status(BAD_REQUEST).send({ message: 'Ошибка при валидации' });
      } else {
        res.status(INTERNAL_SERVER_ERROR).send({ message: 'Внутренняя ошибка сервера' });
      }
    });
};

module.exports.login = (req, res) => {
  const { email, password } = req.body;

  User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        res.status(WRONG_DATA).send({ message: 'Безуспешная авторизация' });
        return;
      }

      bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            res.status(WRONG_DATA).send({ message: 'Безуспешная авторизация' });
            return;
          }

          const token = jwt.sign({ _id: user._id }, 'iam-extra-tired', { expiresIn: '7d' });

          res.cookie('jwt', token, {
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000,
          }).send({ message: 'Успешная авторизация' });
        })
        .catch(() => res.status(INTERNAL_SERVER_ERROR).send({ message: 'Внутренняя ошибка сервера' }));
    })
    .catch(() => res.status(INTERNAL_SERVER_ERROR).send({ message: 'Внутренняя ошибка сервера' }));
};

module.exports.getUserMe = (req, res) => {
  res.status(200).send({ data: req.user });
};
