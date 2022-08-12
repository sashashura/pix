// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const LearningContentDatasources = require('../../infrastructure/datasources/learning-content');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'learningCo... Remove this comment to see the full error message
const learningContentDatasource = require('../../infrastructure/datasources/learning-content/datasource');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'logger'.
const logger = require('../../infrastructure/logger');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  refreshCacheEntries(request: $TSFixMe, h: $TSFixMe) {
    learningContentDatasource
      .refreshLearningContentCacheRecords()
      .catch((e: $TSFixMe) => logger.error('Error while reloading cache', e));
    return h.response({}).code(202);
  },

  refreshCacheEntry(request: $TSFixMe) {
    const updatedRecord = request.payload;
    const recordId = request.params.id;
    const datasource =
      LearningContentDatasources[_.findKey(LearningContentDatasources, { modelName: request.params.model })];
    return datasource.refreshLearningContentCacheRecord(recordId, updatedRecord).then(() => null);
  },
};
