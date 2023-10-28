const mongoose = require('mongoose');
// const validator = require('validator');
const { default: isEmail } = require('validator/lib/isEmail');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: false,
    default: 'Жак-Ив Кусто',
  },
  about: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: false,
    default: 'Исследователь',
  },
  avatar: {
    type: String,
    required: false,
    default:
      'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
  },
  email: {
    type: String,
    required: {
      value: true,
      message: 'Поле email является обязательным.',
    },
    validate: {
      validator(v) {
        return isEmail(v);
      },
      message: (props) => `${props.value} is not a valid email!`,
    },
    unique: true,
  },
  password: {
    type: String,
    required: {
      value: true,
      message: 'Поле email является обязательным.',
    },
    select: false,
  },
});

module.exports = mongoose.model('user', userSchema);
