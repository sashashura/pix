// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'bcrypt'.
const bcrypt = require('bcrypt');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const { bcryptNumberOfSaltRounds } = require('../../config');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'PasswordNo... Remove this comment to see the full error message
const PasswordNotMatching = require('../errors').PasswordNotMatching;

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  hashPassword: (password: $TSFixMe) => bcrypt.hash(password, bcryptNumberOfSaltRounds),

  /* eslint-disable-next-line no-sync */
  hashPasswordSync: (password: $TSFixMe) => bcrypt.hashSync(password, bcryptNumberOfSaltRounds),

  checkPassword: async ({
    password,
    passwordHash
  }: $TSFixMe) => {
    const matching = await bcrypt.compare(password, passwordHash);
    if (!matching) {
      throw new PasswordNotMatching();
    }
  },
};
