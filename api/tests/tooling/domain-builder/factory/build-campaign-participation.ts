// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'CampaignPa... Remove this comment to see the full error message
const CampaignParticipation = require('../../../../lib/domain/models/CampaignParticipation');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'CampaignPa... Remove this comment to see the full error message
const CampaignParticipationStatuses = require('../../../../lib/domain/models/CampaignParticipationStatuses');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'buildCampa... Remove this comment to see the full error message
const buildCampaign = require('./build-campaign');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'SHARED'.
const { SHARED } = CampaignParticipationStatuses;

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = function buildCampaignParticipation({
  id = 1,
  campaign = buildCampaign(),
  sharedAt = new Date('2020-02-01'),
  createdAt = new Date('2020-01-01'),
  deletedAt = null,
  participantExternalId = 'Mon mail pro',
  assessments = [],
  userId = 123,
  status = SHARED,
  validatedSkillsCount,
  organizationLearnerId = null,
  deletedBy = null
}: $TSFixMe = {}) {
  const isShared = status === SHARED;
  return new CampaignParticipation({
    id,
    campaign,
    status,
    sharedAt: isShared ? sharedAt : null,
    createdAt,
    deletedAt,
    participantExternalId,
    assessments,
    userId,
    validatedSkillsCount,
    organizationLearnerId,
    deletedBy,
  });
};
