const userRouter = require('express').Router();
const auth = require('../middlewares/auth');
const {
  getUsers, getUserById, updateUser, updateAvatar, getUserMe,
} = require('../controllers/users');
const {
  validateUserId,
  validateUserUpdate,
  validateAvatarUpdate,
} = require('../middlewares/validation');

userRouter.use(auth);
userRouter.get('/', getUsers);
userRouter.get('/me', getUserMe);
userRouter.get('/:id', validateUserId, getUserById);
userRouter.patch('/me', validateUserUpdate, updateUser);
userRouter.patch('/me/avatar', validateAvatarUpdate, updateAvatar);

module.exports = userRouter;
