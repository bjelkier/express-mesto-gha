const router = require('express').Router();
const userRouter = require('./users');
const cardRouter = require('./cards');
const NotFound = require('../errors/NotFound');

const {
  createUser,
  login,
} = require('../controllers/users');

const {
  validationEmailAndPassword,
} = require('../middlewares/validation');

router.post('/signin', validationEmailAndPassword, login);
router.post('/signup', validationEmailAndPassword, createUser);
router.use('/users', userRouter);
router.use('/cards', cardRouter);
router.use('*', (req, res, next) => {
  next(new NotFound('Неверный путь'));
});

module.exports = router;
