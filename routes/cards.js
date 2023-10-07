const cardRoutes = require('express').Router();
const {
  getCards,
  createCard,
  deleteCardById,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');

cardRoutes.get('/', getCards);
cardRoutes.delete('/:cardId', deleteCardById);
cardRoutes.post('/', createCard);
cardRoutes.put('/:cardId/likes', likeCard);
cardRoutes.delete('/:cardId/likes', dislikeCard);

module.exports = cardRoutes;
