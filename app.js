const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');

const router = require('./routes/index');

const { login } = require('./controllers/users');
const { createUser } = require('./controllers/users');

const { validateProfile } = require('./validators/user-validator');
const NotFoundError = require('./errors/NotFoundError');

const { PORT = 3000 } = process.env;
const MONGO_URL = 'mongodb://127.0.0.1:27017/mestodb';
const app = express();

app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.json());

app.post('/signin', validateProfile, login);
app.post('/signup', validateProfile, createUser);

app.use(router);

app.use('*', (req, res, next) => {
  next(new NotFoundError('Ресурс не найден'));
});

// обработчики ошибок
app.use(errors()); // обработчик ошибок celebrate

app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;

  res.status(statusCode).send({
    // проверяем статус и выставляем сообщение в зависимости от него
    message: statusCode === 500 ? 'На сервере произошла ошибка.' : message,
  });
  next();
});

mongoose
  .connect(MONGO_URL)
  .then(() => {
    console.log('connected to Database!');
  })
  .catch(() => {
    console.log('connection to database failed');
  });

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
