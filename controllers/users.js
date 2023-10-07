const User = require('../models/User');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(() => res.status(500).send({ message: 'Ошибка по умолчанию.' }));
};

module.exports.getUserById = async (req, res) => {
  try {
    // const { id } = req.params;
    const user = await User.findById(req.params.id);

    if (!user) {
      throw new Error('NotFound');
    }

    return res.send(user);
  } catch (error) {
    if (error.message === 'NotFound') {
      return res
        .status(404)
        .send({ message: 'Пользователь по указанному _id не найден.' });
    }
    if (error.name === 'CastError') {
      return res.status(400).send({
        message: 'Переданы некорректные данные пользователя.',
      });
    }
    return res.status(500).send({ message: 'Ошибка по умолчанию.', error });
  }
};

module.exports.createUser = async (req, res) => {
  try {
    const newUser = await new User(req.body);
    return res.status(201).send(await newUser.save());
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).send({
        message: 'Переданы некорректные данные при создании пользователя.',
      });
    }
    return res.status(500).send({ message: 'Ошибка по умолчанию.', error });
  }
};

module.exports.updateUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      throw new Error('NotFound');
    }
    return res.status(201).send(
      await User.findByIdAndUpdate(
        req.user._id,
        {
          name: req.body.name,
          about: req.body.about,
        },
        {
          new: true, // обработчик then получит на вход обновлённую запись
          runValidators: true, // данные будут валидированы перед изменением
          upsert: true, // если пользователь не найден, он будет создан
        },
      ),
    );
  } catch (error) {
    if (error.message === 'NotFound') {
      return res
        .status(404)
        .send({ message: 'Пользователь с указанным _id не найден. ' });
    }
    if (error.name === 'ValidationError') {
      return res.status(400).send({
        message: 'Переданы некорректные данные при обновлении профиля.',
      });
    }
    return res.status(500).send({ message: 'Ошибка по умолчанию.', error });
  }
};

module.exports.updateAvatar = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      throw new Error('NotFound');
    }
    return res.status(201).send(
      await User.findByIdAndUpdate(
        req.user._id,
        {
          avatar: req.body.avatar,
        },
        {
          new: true, // обработчик then получит на вход обновлённую запись
          runValidators: true, // данные будут валидированы перед изменением
          upsert: true, // если пользователь не найден, он будет создан
        },
      ),
    );
  } catch (error) {
    if (error.message === 'NotFound') {
      return res
        .status(404)
        .send({ message: 'Пользователь с указанным _id не найден. ' });
    }
    if (error.name === 'ValidationError') {
      return res.status(400).send({
        message: 'Переданы некорректные данные при обновлении аватара.',
      });
    }
    return res.status(500).send({ message: 'Ошибка по умолчанию.', error });
  }
};
