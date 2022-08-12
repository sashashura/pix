// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Bookshelf'... Remove this comment to see the full error message
const Bookshelf = require('../bookshelf');

// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
require('./User');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'modelName'... Remove this comment to see the full error message
const modelName = 'ResetPasswordDemand';

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = Bookshelf.model(
  modelName,
  {
    tableName: 'reset-password-demands',
    hasTimestamps: ['createdAt', 'updatedAt'],

    user() {
      return this.belongsTo('User', 'email');
    },
  },
  {
    modelName,
  }
);
