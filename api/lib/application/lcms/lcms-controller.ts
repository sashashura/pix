// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'usecases'.
const usecases = require('../../domain/usecases');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'logger'.
const logger = require('../../infrastructure/logger');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  async createRelease(request: $TSFixMe, h: $TSFixMe) {
    usecases
      .createLcmsRelease()
      .then(() => {
        logger.info('Release created and cache reloaded');
      })
      .catch((e: $TSFixMe) => {
        logger.error('Error while creating the release and reloading cache', e);
      });
    return h.response({}).code(204);
  },
};
