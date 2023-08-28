const validationError = require('mongoose').Error.ValidationError;
const castError = require('mongoose').Error.CastError;
const User = require('../models/user');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => {
      if (users.length === 0) {
        res.status(404).send({ message: 'Пользователи не найдены' });
      } else {
        res.status(200).send(users);
      }
    })
    .catch(() => {
      res.status(500).send({ message: 'Внутренняя ошибка сервера' });
    });
};

module.exports.getUserById = (req, res) => {
  const { id } = req.params;
  User.findById(id)
    .then((user) => {
      if (!user) {
        res.status(404).send({ message: 'Пользователь с таким id не найден' });
      } else {
        res.status(200).send(user);
      }
    })
    .catch((err) => {
      if (err instanceof castError) {
        res.status(400).send({ message: 'Передан некорректный id' });
      } else {
        res.status(500).send({ message: 'Внутренняя ошибка сервера' });
      }
    });
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.status(201).send({ data: user }))
    .catch((err) => {
      if (err instanceof validationError || err instanceof castError) {
        res.status(400).send({ message: 'Ошибка при валидации' });
      } else {
        res.status(500).send({ message: 'Внутренняя ошибка сервера' });
      }
    });
};

// module.exports.updateUser = (req, res) => {
//   const { name, about } = req.body;
//   User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
//     .then(((user) => res.status(200).send({ data: user })))
//     .catch((err) => {
//       if (err instanceof validationError) {
//         res.status(400).send({ message: 'Ошибка при валидации' });
//       } else {
//         res.status(500).send({ message: 'Внутренняя ошибка сервера' });
//       }
//     });
// };

// module.exports.updateAvatar = (req, res) => {
//   const { avatar } = req.body;
//   User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
//     .then(((user) => res.status(200).send({ data: user })))
//     .catch((err) => {
//       if (err instanceof validationError) {
//         res.status(400).send({ message: 'Ошибка при валидации' });
//       } else {
//         res.status(500).send({ message: 'Внутренняя ошибка сервера' });
//       }
//     });
// };

module.exports.updateUser = (req, res) => {
  const userId = req.user._id;

  let userInfo;
  if (req.path.includes('avatar')) {
    userInfo = { avatar: req.body.avatar };
  } else {
    userInfo = {
      name: req.body.name,
      about: req.body.about,
    };
  }

  User.findByIdAndUpdate(userId, userInfo, {
    new: true,
    runValidators: true,
    upsert: false,
  })
    .orFail()
    .then(((user) => res.status(200).send(user)))
    .catch((err) => {
      if (err instanceof validationError || err instanceof castError) {
        res.status(400).send({ message: 'Ошибка при валидации' });
      } else {
        res.status(500).send({ message: 'Внутренняя ошибка сервера' });
      }
    });
};
