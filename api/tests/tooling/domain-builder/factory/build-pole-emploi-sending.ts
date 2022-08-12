// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'buildCampa... Remove this comment to see the full error message
const buildCampaignParticipation = require('./build-campaign-participation');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'isUndefine... Remove this comment to see the full error message
const isUndefined = require('lodash/isUndefined');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'PoleEmploi... Remove this comment to see the full error message
const PoleEmploiSending = require('../../../../lib/domain/models/PoleEmploiSending');

const buildPoleEmploiSending = function ({
  type = PoleEmploiSending.TYPES.CAMPAIGN_PARTICIPATION_SHARING,
  campaignParticipationId,
  isSuccessful = true,
  responseCode = '200',
  payload = null,
  createdAt = new Date('2020-01-01')
}: $TSFixMe = {}) {
  campaignParticipationId = isUndefined(campaignParticipationId)
    ? buildCampaignParticipation().id
    : campaignParticipationId;

  return new PoleEmploiSending({
    campaignParticipationId,
    type,
    isSuccessful,
    responseCode,
    payload,
    createdAt,
  });
};

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = buildPoleEmploiSending;
