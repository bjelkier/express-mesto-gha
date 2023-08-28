const validationError = require('mongoose').Error.ValidationError;
const castError = require('mongoose').Error.CastError;
const BadRequest = require('../errors/BadRequest');
const NotFound = require('../errors/NotFound');
const Card = require('../models/card');

module.exports.getCards = (req, res) => Card.find({})
  .then((cards) => res.status(200).send({ data: cards }))
  .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));

module.exports.postCard = (req, res, next) => {
  const { name, link } = req.body;

  const cardData = {
    name,
    link,
    owner: req.user._id,
  };

  Card.create(cardData)
    .then((card) => res.status(201).send({ data: card }))
    .catch((err) => {
      if (err instanceof validationError) {
        next(new BadRequest('Некорректные данные при создании карточки'));
      } else {
        next(err);
      }
    });
};

module.exports.deleteCard = (req, res, next) => {
  const { cardId } = req.params;
  return Card.findByIdAndRemove(cardId)
    .then((card) => res.status(200).send({ data: card }))
    .catch((err) => {
      if (err instanceof castError) {
        next(new BadRequest('Некорректный id карточки'));
      } else { next(err); }
    });
};

module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .populate('owner')
    .then((card) => {
      if (!card) {
        next(new NotFound('Карточка не найдена'));
      }
      return res.send({ data: card });
    })
    .catch((err) => {
      if (err instanceof castError) {
        next(new BadRequest('Передан некорректный id карточки'));
      } else {
        next(err);
      }
    });
};

module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .populate('owner')
    .then((card) => {
      if (!card) {
        next(new NotFound('Карточка не найдена'));
      }
      return res.send({ data: card });
    })
    .catch((err) => {
      if (err instanceof castError) {
        next(new BadRequest('Передан некорректный id карточки'));
      } else {
        next(err);
      }
    });
};
