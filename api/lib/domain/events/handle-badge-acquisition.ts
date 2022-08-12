// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Assessment... Remove this comment to see the full error message
const AssessmentCompleted = require('../events/AssessmentCompleted');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'checkEvent... Remove this comment to see the full error message
const { checkEventTypes } = require('./check-event-types');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'eventTypes... Remove this comment to see the full error message
const eventTypes = [AssessmentCompleted];

const handleBadgeAcquisition = async function ({
  event,
  badgeCriteriaService,
  badgeAcquisitionRepository,
  badgeRepository,
  knowledgeElementRepository,
  targetProfileRepository
}: $TSFixMe) {
  checkEventTypes(event, eventTypes);

  if (event.isCampaignType) {
    const associatedBadges = await _fetchPossibleCampaignAssociatedBadges(event, badgeRepository);
    if (_.isEmpty(associatedBadges)) {
      return;
    }
    const targetProfile = await targetProfileRepository.getByCampaignParticipationId(event.campaignParticipationId);
    const knowledgeElements = await knowledgeElementRepository.findUniqByUserId({ userId: event.userId });

    const validatedBadgesByUser = associatedBadges.filter((badge: $TSFixMe) => badgeCriteriaService.areBadgeCriteriaFulfilled({ knowledgeElements, targetProfile, badge })
    );

    const badgesAcquisitionToCreate = validatedBadgesByUser.map((badge: $TSFixMe) => {
      return {
        badgeId: badge.id,
        userId: event.userId,
        campaignParticipationId: event.campaignParticipationId,
      };
    });

    if (!_.isEmpty(badgesAcquisitionToCreate)) {
      await badgeAcquisitionRepository.createOrUpdate(badgesAcquisitionToCreate);
    }
  }
};

// @ts-expect-error TS(2393): Duplicate function implementation.
function _fetchPossibleCampaignAssociatedBadges(event: $TSFixMe, badgeRepository: $TSFixMe) {
  return badgeRepository.findByCampaignParticipationId(event.campaignParticipationId);
}

handleBadgeAcquisition.eventTypes = eventTypes;
// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = handleBadgeAcquisition;
