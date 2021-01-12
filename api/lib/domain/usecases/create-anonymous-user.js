const User = require('../models/User');

module.exports = async function createAnonymousUser({
  userRepository,
  tokenService,
}) {
  const newUser = await userRepository.create({
    user: new User({
      firstName: '',
      lastName: '',
      cgu: false,
      mustValidateTermsOfService: false,
    }),
  });
  const accessToken = tokenService.createAccessTokenFromUser(newUser.id, 'pix');
  return accessToken;
};
