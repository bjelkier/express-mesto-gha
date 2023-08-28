const validationError = require('mongoose').Error.ValidationError;
const castError = require('mongoose').Error.CastError;
const Card = require('../models/card');

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => {
      if (cards.length === 0) {
        res.status(404).send({ message: 'Нет добавленных карточек' });
      } else {
        res.status(200).send(cards);
      }
    })
    .catch(() => {
      res.status(500).send({ message: 'Внутренняя ошибка сервера' });
    });
};

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
        res.status(400).send({ message: 'Ошибка при валидации' });
      } else {
        res.status(500).send({ message: 'Внутренняя ошибка сервера' });
      }
    });
};

module.exports.deleteCard = (req, res) => {
  const { cardId } = req.params;
  Card.findByIdAndRemove(cardId)
    .then((card) => {
      if (!card) {
        res.status(404).send({ message: 'Карточка с таким id не найдена' });
      } else {
        res.status(200).send(card);
      }
    })
    .catch((err) => {
      if (err instanceof castError) {
        res.status(400).send({ message: 'Передан некорректный id карточки' });
      } else {
        res.status(500).send({ message: 'Внутренняя ошибка сервера' });
      }
    });
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .populate('owner')
    .then((card) => {
      if (!card) {
        res.status(404).send({ message: 'Карточка с таким id не найдена' });
      } else {
        res.status(200).send({ data: card });
      }
    })
    .catch((err) => {
      if (err instanceof castError) {
        res.status(400).send({ message: 'Передан некорректный id карточки' });
      } else {
        res.status(500).send({ message: 'Внутренняя ошибка сервера' });
      }
    });
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .populate('owner')
    .then((card) => {
      if (!card) {
        res.status(404).send({ message: 'Карточка с таким id не найдена' });
      } else {
        res.status(200).send({ data: card });
      }
    })
    .catch((err) => {
      if (err instanceof castError) {
        res.status(400).send({ message: 'Передан некорректный id карточки' });
      } else {
        res.status(500).send({ message: 'Внутренняя ошибка сервера' });
      }
    });
};
