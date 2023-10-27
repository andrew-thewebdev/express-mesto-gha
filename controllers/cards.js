const Card = require('../models/Card');

const NotFoundError = require('../errors/NotFoundError');
const BadRequestError = require('../errors/BadRequestError');
const PermissionError = require('../errors/PermissionError');

module.exports.getCards = (req, res, next) => {
  // prettier-ignore
  Card.find({})
    .populate('owner')
    .then((cards) => res.send(cards))
    .catch(next);
};

module.exports.createCard = async (req, res, next) => {
  try {
    const { name, link } = req.body;
    const ownerID = req.user._id;
    const newCard = await new Card({ name, link, owner: ownerID });
    await Card.populate(newCard, 'owner');
    return res.status(201).send(await newCard.save());
  } catch (error) {
    if (error.name === 'ValidationError') {
      return next(
        new BadRequestError(
          'Переданы некорректные данные при создании карточки.',
        ),
      );
    }
    return next(error);
  }
};

module.exports.deleteCardById = async (req, res, next) => {
  try {
    const { cardId } = req.params;
    const card = await Card.findById(cardId);

    if (!card) {
      throw new NotFoundError('Карточка с указанным _id не найдена.');
    }

    if (String(card.owner._id) !== req.user._id) {
      throw new PermissionError('У вас нет прав для удаления чужих карточек');
    }

    await Card.deleteOne({ _id: cardId });

    return res.send({ message: 'Пост удалён' });
  } catch (error) {
    if (error.name === 'CastError') {
      return next(new BadRequestError('Передан не валидный ID карточки'));
    }
    return next(error);
  }
};

module.exports.likeCard = async (req, res, next) => {
  try {
    const { cardId } = req.params;
    const card = await Card.findById(cardId);

    if (!card) {
      throw new NotFoundError('Передан несуществующий _id карточки.');
    }

    const liker = req.user._id;

    const likeCardResult = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: liker } }, // добавить _id в массив, если его там нет
      { new: true },
    );
    await Card.populate(card, 'owner');
    return res.send(likeCardResult);
  } catch (error) {
    if (error.name === 'CastError') {
      return next(
        new BadRequestError(
          'Переданы некорректные данные для постановки лайка.',
        ),
      );
    }
    return next(error);
  }
};

module.exports.dislikeCard = async (req, res, next) => {
  try {
    const { cardId } = req.params;
    const card = await Card.findById(cardId);

    if (!card) {
      throw new NotFoundError('Передан несуществующий _id карточки.');
    }

    // const disliker = await User.findById(req.user._id);
    const disliker = req.user._id;
    const likeCardResult = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: disliker } }, // убрать _id из массива
      { new: true },
    );

    return res.send(likeCardResult);
  } catch (error) {
    if (error.name === 'CastError') {
      return next(
        new BadRequestError('Переданы некорректные данные для снятия лайка.'),
      );
    }
    return next(error);
  }
};
