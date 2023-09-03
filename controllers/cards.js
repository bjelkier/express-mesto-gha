const validationError = require('mongoose').Error.ValidationError;
const castError = require('mongoose').Error.CastError;
const Card = require('../models/card');

const INTERNAL_SERVER_ERROR = 500;
const BAD_REQUEST = 400;
const NOT_FOUND = 404;

const Forbidden = require('../errors/Forbidden');

module.exports.getCards = (req, res) => Card.find({})
  .then((cards) => res.status(200).send({ data: cards }))
  .catch(() => res.status(INTERNAL_SERVER_ERROR).send({ message: 'Внутренняя ошибка сервера' }));

module.exports.postCard = (req, res) => {
  const { name, link } = req.body;

  const cardData = {
    name,
    link,
    owner: req.user._id,
  };

  Card.create(cardData)
    .then((card) => {
      res.status(201).send({ data: card });
    })
    .catch((err) => {
      if (err instanceof validationError) {
        res.status(BAD_REQUEST).send({ message: 'Ошибка при валидации' });
      } else {
        res.status(INTERNAL_SERVER_ERROR).send({ message: 'Внутренняя ошибка сервера' });
      }
    });
};

module.exports.deleteCard = (req, res, next) => {
  const { cardId } = req.params;
  Card.findById(cardId)
    // eslint-disable-next-line consistent-return
    .then((card) => {
      if (card === null) {
        res.status(NOT_FOUND).send({ message: 'Карточка с таким id не найдена' });
      }
      if (!(card.owner.toString() === req.user._id)) {
        return next(new Forbidden('Вы не можете удалять чужие карточки'));
      }
      Card.findByIdAndRemove(cardId)
        // eslint-disable-next-line consistent-return
        .then((data) => {
          if (data) {
            return res.send({ message: 'Карточка удалена' });
          }
        })
        .catch((err) => {
          if (err instanceof castError) {
            res.status(BAD_REQUEST).send({ message: 'Передан некорректный id карточки' });
          } else { next(err); }
        });
    })
    .catch((err) => {
      next(err);
    });
};

const handleCardOperation = (req, res, operation) => {
  const { cardId } = req.params;
  operation(cardId)
    .then((card) => {
      if (!card) {
        res.status(NOT_FOUND).send({ message: 'Карточка с таким id не найдена' });
      } else {
        res.status(200).send({ data: card });
      }
    })
    .catch((err) => {
      if (err instanceof castError) {
        res.status(BAD_REQUEST).send({ message: 'Передан некорректный id карточки' });
      } else {
        res.status(INTERNAL_SERVER_ERROR).send({ message: 'Внутренняя ошибка сервера' });
      }
    });
};

module.exports.likeCard = (req, res) => {
  const operation = (cardId) => Card.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  ).populate('owner');
  handleCardOperation(req, res, operation);
};

module.exports.dislikeCard = (req, res) => {
  const operation = (cardId) => Card.findByIdAndUpdate(
    cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  ).populate('owner');
  handleCardOperation(req, res, operation);
};
