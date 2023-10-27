const jwt = require('jsonwebtoken');
const AuthenticationError = require('../errors/AuthenticationError');

// export default function (req, res, next) {
module.exports = (req, res, next) => {
  let payload;
  try {
    // const token = req.headers.authorization;
    if (!req.headers.authorization) {
      // throw new Error('NotAuthenticated');
      throw new AuthenticationError('Ошибка аутентификации');
    }
    const token = req.headers.authorization.replace('Bearer ', '');
    if (!token) {
      // throw new Error('NotAuthenticated');
      throw new AuthenticationError('Ошибка аутентификации');
    }

    payload = jwt.verify(token, 'super-strong-secret');
  } catch (error) {
    // if (error.message === 'NotAuthenticated') {
    //   return res
    //     .status(401)
    //     .send({ message: 'Неправильный email или password' });
    // }
    if (error.name === 'JsonWebTokenError') {
      // return res.status(401).send({ message: 'Вы не авторизованы' });
      return next(new AuthenticationError('Ошибка аутентификации'));
    }

    // return res.status(500).send({ message: 'На сервере произошла ошибка' });
    return next(error);
  }

  req.user = payload;
  return next();
};
