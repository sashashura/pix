// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'CampaignPr... Remove this comment to see the full error message
const CampaignProfileCompetence = require('./CampaignProfileCompetence');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'CampaignPa... Remove this comment to see the full error message
const CampaignParticipationStatuses = require('../models/CampaignParticipationStatuses');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'SHARED'.
const { SHARED } = CampaignParticipationStatuses;

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'CampaignPr... Remove this comment to see the full error message
class CampaignProfile {
  campaignId: $TSFixMe;
  campaignParticipationId: $TSFixMe;
  createdAt: $TSFixMe;
  externalId: $TSFixMe;
  firstName: $TSFixMe;
  isShared: $TSFixMe;
  lastName: $TSFixMe;
  pixScore: $TSFixMe;
  placementProfile: $TSFixMe;
  sharedAt: $TSFixMe;
  constructor({
    firstName,
    lastName,
    placementProfile,
    campaignParticipationId,
    campaignId,
    participantExternalId,
    sharedAt,
    status,
    createdAt,
    pixScore
  }: $TSFixMe) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.campaignParticipationId = campaignParticipationId;
    this.campaignId = campaignId;
    this.externalId = participantExternalId;
    this.sharedAt = sharedAt;
    this.isShared = status === SHARED;
    this.createdAt = createdAt;
    this.placementProfile = placementProfile;
    this.pixScore = pixScore;
  }

  get isCertifiable() {
    if (this.isShared) {
      return this.placementProfile.isCertifiable();
    }
    return null;
  }

  get certifiableCompetencesCount() {
    if (this.isShared) {
      return this.placementProfile.getCertifiableCompetencesCount();
    }
    return null;
  }

  get competencesCount() {
    if (this.isShared) {
      return this.placementProfile.getCompetencesCount();
    }
    return null;
  }

  get competences() {
    if (this.isShared) {
      return this.placementProfile.userCompetences.map((competence: $TSFixMe) => {
        return new CampaignProfileCompetence(competence);
      });
    }
    return [];
  }
}

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = CampaignProfile;
