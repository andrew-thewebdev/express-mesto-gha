const router = require('express').Router();
const userRoutes = require('./users');
const cardRoutes = require('./cards');
const auth = require('../middlewares/auth');

// router.use('/users', userRoutes);
// router.use('/cards', cardRoutes);
router.use('/users', auth, userRoutes);
router.use('/cards', auth, cardRoutes);
module.exports = router;
