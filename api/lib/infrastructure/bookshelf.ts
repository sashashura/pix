// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const validator = require('validator');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'knex'.
const { knex } = require('../../db/knex-database-connection');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const bookshelf = require('bookshelf')(knex);

validator.isRequired = function (value: $TSFixMe) {
  return !_.isNil(value);
};

validator.isTrue = function (value: $TSFixMe) {
  return _.isBoolean(value) && value === true;
};

bookshelf.plugin('bookshelf-validate', {
  validateOnSave: true,
  validator: validator,
});

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = bookshelf;
