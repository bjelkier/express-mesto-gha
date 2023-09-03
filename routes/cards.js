const cardRouter = require('express').Router();
const auth = require('../middlewares/auth');
const {
  validationCardInfo,
  validationCardId,
} = require('../middlewares/validation');

const {
  getCards,
  postCard,
  deleteCard,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');

cardRouter.use(auth);
cardRouter.get('/', getCards);
cardRouter.post('/', validationCardInfo, postCard);
cardRouter.delete('/:cardId', validationCardId, deleteCard);
cardRouter.put('/:cardId/likes', validationCardId, likeCard);
cardRouter.delete('/:cardId/likes', validationCardId, dislikeCard);

module.exports = cardRouter;
