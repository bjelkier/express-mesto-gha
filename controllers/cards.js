const Card = require('../models/card');
const {
  NOT_FOUND,
  UNAUTHORIZED,
} = require('../utils/constants');

const { validateCard, validateCardId } = require('../middlewares/validation');

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.status(200).send({ data: cards }))
    .catch((err) => {
      next(err);
    });
};

module.exports.postCard = (req, res, next) => {
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
      next(err);
    });
};

module.exports.deleteCard = (req, res, next) => {
  const { cardId } = req.params;
  const userId = req.user._id;

  Card.findById(cardId)
    .then((card) => {
      if (!card) {
        return res.status(NOT_FOUND).send({ message: 'Карточка с таким id не найдена' });
      }

      if (card.owner.toString() !== userId) {
        return res.status(UNAUTHORIZED).send({ message: 'Нельзя удалить чужую карточку' });
      }

      return Card.findByIdAndRemove(cardId)
        .then((removedCard) => {
          if (!removedCard) {
            res.status(NOT_FOUND).send({ message: 'Карточка с таким id не найдена' });
          } else {
            res.status(200).send(removedCard);
          }
        })
        .catch((err) => {
          next(err);
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
      // eslint-disable-next-line no-undef
      next(err);
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

module.exports = {
  validateCard,
  validateCardId,
};
