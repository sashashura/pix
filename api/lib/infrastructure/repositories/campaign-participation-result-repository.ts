// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'CampaignPa... Remove this comment to see the full error message
const CampaignParticipationResult = require('../../domain/models/CampaignParticipationResult');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'campaignPa... Remove this comment to see the full error message
const campaignParticipationRepository = require('./campaign-participation-repository');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'targetProf... Remove this comment to see the full error message
const targetProfileRepository = require('./target-profile-repository');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'competence... Remove this comment to see the full error message
const competenceRepository = require('./competence-repository');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'assessment... Remove this comment to see the full error message
const assessmentRepository = require('./assessment-repository');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'knowledgeE... Remove this comment to see the full error message
const knowledgeElementRepository = require('./knowledge-element-repository');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'campaignPa... Remove this comment to see the full error message
const campaignParticipationResultRepository = {
  async getByParticipationId(campaignParticipationId: $TSFixMe, campaignBadges: $TSFixMe, acquiredBadgeIds: $TSFixMe, locale: $TSFixMe) {
    const campaignParticipation = await campaignParticipationRepository.get(campaignParticipationId);

    const [targetProfile, competences, assessment] = await Promise.all([
      targetProfileRepository.getByCampaignId(campaignParticipation.campaignId),
      competenceRepository.list({ locale }),
      assessmentRepository.get(campaignParticipation.lastAssessment.id),
    ]);

    const snapshots = await knowledgeElementRepository.findSnapshotForUsers({
      [campaignParticipation.userId]: campaignParticipation.sharedAt,
    });
    return CampaignParticipationResult.buildFrom({
      campaignParticipationId,
      assessment,
      competences,
      targetProfile,
      knowledgeElements: snapshots[campaignParticipation.userId],
      campaignBadges,
      acquiredBadgeIds,
    });
  },
};

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = campaignParticipationResultRepository;
