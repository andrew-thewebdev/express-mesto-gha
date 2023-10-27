const cardRoutes = require('express').Router();
const {
  getCards,
  createCard,
  deleteCardById,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');

const {
  validateCard,
  validateCardId,
} = require('../validators/card-validator');

cardRoutes.get('/', getCards);
cardRoutes.delete('/:cardId', validateCardId, deleteCardById);
cardRoutes.post('/', validateCard, createCard);
cardRoutes.put('/:cardId/likes', validateCardId, likeCard);
cardRoutes.delete('/:cardId/likes', validateCardId, dislikeCard);

module.exports = cardRoutes;
