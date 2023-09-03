const validationError = require('mongoose').Error.ValidationError;
const castError = require('mongoose').Error.CastError;
const Card = require('../models/card');

const BadRequest = require('../errors/BadRequest');
const NotFound = require('../errors/NotFound');
const Forbidden = require('../errors/Forbidden');

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((data) => res.send(data))
    .catch(next);
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
      res.send({ data: card });
    })
    .catch((err) => {
      if (err instanceof validationError) {
        next(new BadRequest('Ошибка при валидации'));
      } else {
        next(err);
      }
    });
};

module.exports.deleteCard = (req, res, next) => {
  const { cardId } = req.params;
  Card.findById(cardId)
    // eslint-disable-next-line consistent-return
    .then((card) => {
      if (card === null) {
        return next(new NotFound('Карточка с таким id не найдена'));
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
            next(new BadRequest('Передан некорректный id карточки'));
          } else { next(err); }
        });
    })
    .catch(next);
};

module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .populate('owner')
    .then((card) => {
      if (card) {
        res.send({ data: card });
      } else {
        next(new NotFound('Карточка с таким id не найдена'));
      }
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
  Card.findByIdAndUpdate(req.params.cardId, { $pull: { likes: req.user._id } }, { new: true })
    .then((card) => {
      if (card) {
        res.send({ data: card });
      } else {
        next(new NotFound('Карточка с таким id не найдена'));
      }
    })
    .catch((err) => {
      if (err instanceof castError) {
        next(new BadRequest('Передан некорректный id карточки'));
      } else {
        next(err);
      }
    });
};
