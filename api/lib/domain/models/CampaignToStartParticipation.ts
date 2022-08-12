// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'CampaignTy... Remove this comment to see the full error message
const CampaignTypes = require('../models/CampaignTypes');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'CampaignTo... Remove this comment to see the full error message
class CampaignToStartParticipation {
  archivedAt: $TSFixMe;
  assessmentMethod: $TSFixMe;
  id: $TSFixMe;
  idPixLabel: $TSFixMe;
  isRestricted: $TSFixMe;
  multipleSendings: $TSFixMe;
  organizationId: $TSFixMe;
  skillCount: $TSFixMe;
  type: $TSFixMe;
  constructor({
    id,
    idPixLabel,
    archivedAt,
    type,
    isRestricted,
    multipleSendings,
    assessmentMethod,
    skillCount,
    organizationId
  }: $TSFixMe = {}) {
    this.id = id;
    this.type = type;
    this.idPixLabel = idPixLabel;
    this.archivedAt = archivedAt;
    this.isRestricted = isRestricted;
    this.multipleSendings = multipleSendings;
    this.assessmentMethod = assessmentMethod;
    this.skillCount = skillCount;
    this.organizationId = organizationId;
  }

  get isAssessment() {
    return this.type === CampaignTypes.ASSESSMENT;
  }

  get isArchived() {
    return Boolean(this.archivedAt);
  }
}

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = CampaignToStartParticipation;
