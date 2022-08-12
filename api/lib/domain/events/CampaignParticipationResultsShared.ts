// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Event'.
const Event = require('./Event');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'CampaignPa... Remove this comment to see the full error message
class CampaignParticipationResultsShared extends Event {
  campaignParticipationId: $TSFixMe;
  constructor({
    campaignParticipationId
  }: $TSFixMe = {}) {
    super();
    this.campaignParticipationId = campaignParticipationId;
  }
}

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = CampaignParticipationResultsShared;
