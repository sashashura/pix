const UserWithOrganizationLearner = require('../../../../lib/domain/models/UserWithOrganizationLearner');

module.exports = function buildUserWithOrganizationLearner({
  lastName = 'jeanne',
  firstName = 'serge',
  birthdate = '2001-05-07',
  username = this.lastName + this.firstName + '1234',
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
