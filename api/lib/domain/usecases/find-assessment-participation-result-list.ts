// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'findAssess... Remove this comment to see the full error message
function findAssessmentParticipationResultList({
  campaignId,
  filters,
  page,
  campaignAssessmentParticipationResultListRepository
}: $TSFixMe) {
  return campaignAssessmentParticipationResultListRepository.findPaginatedByCampaignId({ campaignId, filters, page });
}

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = findAssessmentParticipationResultList;
