const userRouter = require('express').Router();
const {
  getUsers, getUserById, updateUser, updateAvatar, getUserMe,
} = require('../controllers/users');

userRouter.get('/me', getUserMe);
userRouter.get('/', getUsers);
userRouter.get('/:id', getUserById);
userRouter.patch('/me', updateUser);
userRouter.patch('/me/avatar', updateAvatar);

module.exports = userRouter;
