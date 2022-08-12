// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Serializer... Remove this comment to see the full error message
const { Serializer } = require('jsonapi-serializer');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  serialize(authentications: $TSFixMe) {
    return new Serializer('authentication', {
      attributes: ['token', 'user_id', 'password'],
      transform(model: $TSFixMe) {
        const authentication = Object.assign({}, model.toJSON());
        authentication.user_id = model.userId.toString();
        authentication.id = model.userId;
        authentication.password = '';
        return authentication;
      },
    }).serialize(authentications);
  },
};
