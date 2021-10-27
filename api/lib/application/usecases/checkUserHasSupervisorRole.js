const sessionRepository = require('../../infrastructure/repositories/session-for-supervising-repository');

const execute = ({ userId, sessionId }) => {
  return sessionRepository.userHasSupervisorRole({ userId, sessionId });
};

module.exports = {
  execute,
};
