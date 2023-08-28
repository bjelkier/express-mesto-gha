const router = require('express').Router();
const userRouter = require('./users');
const cardRouter = require('./cards');

const NOT_FOUND = 404;

router.use('/users', userRouter);
router.use('/cards', cardRouter);
router.use('*', (req, res) => {
  res.status(NOT_FOUND).send({ message: 'Неверный путь' });
});

module.exports = router;
