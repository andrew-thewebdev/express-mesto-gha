const { celebrate, Joi } = require('celebrate');
// prettier-ignore
const urlRegexp = /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,3}(:\d{1,5})?([/?#]\S*)?$/;
const emailRegexp = /\w+@\w+\.\w+/;

module.exports = {
  validateProfile: celebrate({
    body: Joi.object()
      .keys({
        // name: Joi.string().default('Жак-Ив Кусто').required().min(2).max(30),
        name: Joi.string().default('Жак-Ив Кусто').min(2).max(30),
        about: Joi.string().default('Исследователь').min(2).max(30),
        avatar: Joi.string().regex(urlRegexp),
        email: Joi.string().required().regex(emailRegexp),
        password: Joi.string().required(),
      })
      .unknown(true),
  }),
  validateProfileUpdate: celebrate({
    body: Joi.object().keys({
      name: Joi.string().default('Жак-Ив Кусто').min(2).max(30),
      about: Joi.string().default('Исследователь').min(2).max(30),
    }),
  }),
  validateObjId: celebrate({
    params: Joi.object().keys({
      id: Joi.string().alphanum().length(24),
    }),
  }),
  validateAvatar: celebrate({
    body: Joi.object().keys({
      avatar: Joi.string().regex(urlRegexp),
    }),
  }),
};
