const Card = require('../models/Card');

module.exports.getCards = (req, res) => {
  // prettier-ignore
  Card.find({})
    .populate('owner')
    .then((cards) => res.send(cards))
    .catch(() => res.status(500).send({ message: 'На сервере произошла ошибка' }));
};

module.exports.createCard = async (req, res) => {
  try {
    const { name, link } = req.body;
    const ownerID = req.user._id;
    const newCard = await new Card({ name, link, owner: ownerID });
    await Card.populate(newCard, 'owner');
    return res.status(201).send(await newCard.save());
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).send({
        message: 'Переданы некорректные данные при создании карточки.',
      });
    }
    return res
      .status(500)
      .send({ message: 'На сервере произошла ошибка', error });
  }
};

module.exports.deleteCardById = async (req, res) => {
  try {
    const { cardId } = req.params;
    const card = await Card.findById(cardId);

    if (!card) {
      throw new Error('NotFound');
    }
    await Card.deleteOne({ _id: cardId });

    return res.send({ message: 'Пост удалён' });
  } catch (error) {
    if (error.message === 'NotFound') {
      return res
        .status(404)
        .send({ message: 'Карточка с указанным _id не найдена.' });
    }
    if (error.name === 'CastError') {
      return res
        .status(400)
        .send({ message: 'Передан не валидный ID карточки' });
    }
    return res
      .status(500)
      .send({ message: 'На сервере произошла ошибка', error });
  }
};

module.exports.likeCard = async (req, res) => {
  try {
    const { cardId } = req.params;
    const card = await Card.findById(cardId);

    if (!card) {
      throw new Error('NotFound');
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
    if (error.message === 'NotFound') {
      return res
        .status(404)
        .send({ message: 'Передан несуществующий _id карточки.' });
    }
    if (error.name === 'CastError') {
      return res.status(400).send({
        message: 'Переданы некорректные данные для постановки лайка.',
      });
    }
    return res
      .status(500)
      .send({ message: 'На сервере произошла ошибка', error });
  }
};

module.exports.dislikeCard = async (req, res) => {
  try {
    const { cardId } = req.params;
    const card = await Card.findById(cardId);

    if (!card) {
      throw new Error('NotFound');
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
    if (error.message === 'NotFound') {
      return res
        .status(404)
        .send({ message: 'Передан несуществующий _id карточки.' });
    }
    if (error.name === 'CastError') {
      return res
        .status(400)
        .send({ message: 'Переданы некорректные данные для снятии лайка.' });
    }
    return res
      .status(500)
      .send({ message: 'На сервере произошла ошибка', error });
  }
};
