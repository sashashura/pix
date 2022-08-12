// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'UserWithOr... Remove this comment to see the full error message
const UserWithOrganizationLearner = require('../../../../lib/domain/models/UserWithOrganizationLearner');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = function buildUserWithOrganizationLearner({
  lastName = 'jeanne',
  firstName = 'serge',
  birthdate = '2001-05-07',
  // @ts-expect-error TS(2683): 'this' implicitly has type 'any' because it does n... Remove this comment to see the full error message
  username = this.lastName + this.firstName + '1234',
  // @ts-expect-error TS(2683): 'this' implicitly has type 'any' because it does n... Remove this comment to see the full error message
  email = this.lastName + this.firstName + '@example.net',
  isAuthenticatedFromGAR = false,
} = {}) {
  return new UserWithOrganizationLearner({
    lastName,
    firstName,
    birthdate,
    username,
    email,
    isAuthenticatedFromGAR,
  });
};
