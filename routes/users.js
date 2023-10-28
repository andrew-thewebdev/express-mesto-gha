const userRoutes = require('express').Router();
const {
  getUsers,
  getUserById,
  getCurrentUser,
} = require('../controllers/users');
const { updateUser, updateAvatar } = require('../controllers/users');
const {
  // validateProfile,
  validateObjId,
  validateAvatar,
  validateProfileUpdate,
} = require('../validators/user-validator');

userRoutes.get('/me', getCurrentUser);

userRoutes.get('/', getUsers);
userRoutes.get('/:id', validateObjId, getUserById);
userRoutes.patch('/me', validateProfileUpdate, updateUser);
userRoutes.patch('/me/avatar', validateAvatar, updateAvatar);

module.exports = userRoutes;
