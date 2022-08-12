// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Serializer... Remove this comment to see the full error message
const { Serializer } = require('jsonapi-serializer');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  serializeForPaginatedList(userCampaignParticipationOverviewsPaginatedList: $TSFixMe) {
    const { campaignParticipationOverviews, pagination } = userCampaignParticipationOverviewsPaginatedList;
    return this.serialize(campaignParticipationOverviews, pagination);
  },

  serialize(campaignParticipationOverview: $TSFixMe, meta: $TSFixMe) {
    return new Serializer('campaign-participation-overview', {
      attributes: [
        'isShared',
        'sharedAt',
        'createdAt',
        'organizationName',
        'status',
        'campaignCode',
        'campaignTitle',
        'disabledAt',
        'masteryRate',
        'validatedStagesCount',
        'totalStagesCount',
      ],
      meta,
    }).serialize(campaignParticipationOverview);
  },
};
