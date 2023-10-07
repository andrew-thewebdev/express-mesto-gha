const userRoutes = require('express').Router();
const { getUsers, getUserById, createUser } = require('../controllers/users');
const { updateUser, updateAvatar } = require('../controllers/users');

userRoutes.get('/', getUsers);
userRoutes.get('/:id', getUserById);
userRoutes.post('/', createUser);

userRoutes.patch('/me', updateUser);
userRoutes.patch('/me/avatar', updateAvatar);

module.exports = userRoutes;
