const validationError = require('mongoose').Error.ValidationError;
const castError = require('mongoose').Error.CastError;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const BadRequest = require('../errors/BadRequest');
const NotFound = require('../errors/NotFound');
const Conflict = require('../errors/Conflict');

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then(((data) => res.send(data)))
    .catch(next);
};

module.exports.getUserById = (req, res, next) => {
  const { id } = req.params;
  User.findById(id)
    .then(((user) => {
      if (user) {
        res.send({ data: user });
      } else {
        next(new NotFound('Пользователь с таким id не найден'));
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
  const {
    name,
    about,
    avatar,
    email,
  } = req.body;
  bcrypt.hash(req.body.password, 10)
    .then((hashedPassword) => {
      User.create({
        name,
        about,
        avatar,
        email,
        password: hashedPassword,
      })
        .then(((user) => {
          const userWithoutPassword = user.toObject();
          delete userWithoutPassword.password;
          res.send({ data: userWithoutPassword });
        }))
        .catch((err) => {
          if (err.code === 11000) {
            next(new Conflict('Данный email уже используется'));
          }
          if (err instanceof validationError) {
            next(new BadRequest('Ошибка при валидации'));
          } else {
            next(err);
          }
        });
    })
    .catch(next);
};

module.exports.updateUser = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .then(((user) => res.send({ data: user })))
    .catch((err) => {
      if (err instanceof validationError) {
        next(new BadRequest('Ошибка при валидации'));
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
        next(new BadRequest('Ошибка при валидации'));
      } else {
        next(err);
      }
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        'iam-extra-tired',
        { expiresIn: '7d' },
      );
      res.cookie('jwt', token, {
        maxAge: 3600000 * 24 * 7,
        httpOnly: true,
        sameSite: true,
      });
      res.send({ jwt: token })
        .end();
    })
    .catch(next);
};

module.exports.getUserMe = (req, res, next) => {
  User.findById(req.user._id)
    .then(((data) => res.send(data)))
    .catch(next);
};
