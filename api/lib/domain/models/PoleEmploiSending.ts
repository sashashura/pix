// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'TYPES'.
const TYPES = {
  CAMPAIGN_PARTICIPATION_START: 'CAMPAIGN_PARTICIPATION_START',
  CAMPAIGN_PARTICIPATION_COMPLETION: 'CAMPAIGN_PARTICIPATION_COMPLETION',
  CAMPAIGN_PARTICIPATION_SHARING: 'CAMPAIGN_PARTICIPATION_SHARING',
};

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'PoleEmploi... Remove this comment to see the full error message
class PoleEmploiSending {
  static TYPES = TYPES;

  campaignParticipationId: $TSFixMe;
  isSuccessful: $TSFixMe;
  payload: $TSFixMe;
  responseCode: $TSFixMe;
  type: $TSFixMe;

  constructor({
    campaignParticipationId,
    type,
    payload,
    isSuccessful,
    responseCode
  }: $TSFixMe) {
    this.campaignParticipationId = campaignParticipationId;
    this.type = type;
    this.isSuccessful = isSuccessful;
    this.responseCode = responseCode;
    this.payload = payload;
  }

  static buildForParticipationStarted({
    campaignParticipationId,
    payload,
    isSuccessful,
    responseCode
  }: $TSFixMe) {
    return new PoleEmploiSending({
      campaignParticipationId,
      type: TYPES.CAMPAIGN_PARTICIPATION_START,
      payload,
      isSuccessful,
      responseCode,
    });
  }

  static buildForParticipationFinished({
    campaignParticipationId,
    payload,
    isSuccessful,
    responseCode
  }: $TSFixMe) {
    return new PoleEmploiSending({
      campaignParticipationId,
      type: TYPES.CAMPAIGN_PARTICIPATION_COMPLETION,
      payload,
      isSuccessful,
      responseCode,
    });
  }

  static buildForParticipationShared({
    campaignParticipationId,
    payload,
    isSuccessful,
    responseCode
  }: $TSFixMe) {
    return new PoleEmploiSending({
      campaignParticipationId,
      type: TYPES.CAMPAIGN_PARTICIPATION_SHARING,
      payload,
      isSuccessful,
      responseCode,
    });
  }
}
// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = PoleEmploiSending;
