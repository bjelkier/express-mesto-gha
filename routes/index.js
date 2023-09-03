const router = require('express').Router();
const userRouter = require('./users');
const cardRouter = require('./cards');
const { NOT_FOUND } = require('../utils/constants');

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
router.use('*', (req, res) => {
  res.status(NOT_FOUND).send({ message: 'Неверный путь' });
});

module.exports = router;
