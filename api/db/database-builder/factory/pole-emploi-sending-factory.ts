// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'buildCampa... Remove this comment to see the full error message
const buildCampaignParticipation = require('./build-campaign-participation');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const buildUser = require('./build-user');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'buildAuthe... Remove this comment to see the full error message
const buildAuthenticationMethod = require('./build-authentication-method');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'databaseBu... Remove this comment to see the full error message
const databaseBuffer = require('../database-buffer');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');

// @ts-expect-error TS(2393): Duplicate function implementation.
function build({
  id = databaseBuffer.getNextId(),
  isSuccessful = true,
  responseCode = '200',
  type = 'CAMPAIGN_PARTICIPATION_START',
  payload = { individu: {} },
  createdAt = new Date('2020-01-01'),
  campaignParticipationId
}: $TSFixMe = {}) {
  campaignParticipationId = _.isNil(campaignParticipationId)
    ? buildCampaignParticipation().id
    : campaignParticipationId;

  const values = {
    id,
    isSuccessful,
    responseCode,
    type,
    payload,
    createdAt,
    campaignParticipationId,
  };
  return databaseBuffer.pushInsertable({
    tableName: 'pole-emploi-sendings',
    values,
  });
}

function buildWithUser(sendingAttributes: $TSFixMe, externalIdentifier: $TSFixMe) {
  const { id: userId } = buildUser();
  (buildAuthenticationMethod as $TSFixMe).withPoleEmploiAsIdentityProvider({ userId, externalIdentifier });
  const { id: campaignParticipationId } = buildCampaignParticipation({ userId });
  return build({ ...sendingAttributes, campaignParticipationId });
}

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  build,
  buildWithUser,
};
