const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const router = require('./routes/index');

const { PORT = 3000 } = process.env;
const MONGO_URL = 'mongodb://127.0.0.1:27017/mestodb';
const app = express();

app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.json());

app.use((req, res, next) => {
  req.user = {
    _id: '65194ee5ec4e03d43e1a7edb',
  };

  next();
});

app.use(router);

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
