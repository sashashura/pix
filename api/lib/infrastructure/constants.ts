// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'settings'.
const settings = require('../config');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  CONCURRENCY_HEAVY_OPERATIONS: settings.infra.concurrencyForHeavyOperations,
  CHUNK_SIZE_CAMPAIGN_RESULT_PROCESSING: settings.infra.chunkSizeForCampaignResultProcessing,
  ORGANIZATION_LEARNER_CHUNK_SIZE: settings.infra.chunkSizeForOrganizationLearnerDataProcessing,
};
