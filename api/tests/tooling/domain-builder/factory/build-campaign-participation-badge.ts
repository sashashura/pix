// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'CampaignPa... Remove this comment to see the full error message
const CampaignParticipationBadge = require('../../../../lib/domain/models/CampaignParticipationBadge');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = function buildCampaignParticipationBadge({
  id = 123,
  key,
  altMessage,
  imageUrl,
  message,
  title,
  isAcquired = false,
  isCertifiable = false,
  badgeCriteria = [],
  skillSets = [],
  skillSetResults = []
}: $TSFixMe = {}) {
  return new CampaignParticipationBadge({
    id,
    key,
    altMessage,
    imageUrl,
    message,
    title,
    isAcquired,
    isCertifiable,
    badgeCriteria,
    skillSets,
    skillSetResults,
  });
};
