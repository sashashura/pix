// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'PIX_EMPLOI... Remove this comment to see the full error message
const { PIX_EMPLOI_CLEA_V1, PIX_EMPLOI_CLEA_V2, PIX_EMPLOI_CLEA_V3, PIX_DROIT_MAITRE_CERTIF, PIX_DROIT_EXPERT_CERTIF } =
  // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
  require('../models/Badge').keys;

const complementaryCertificationStatus = {
  ACQUIRED: 'Validée',
  REJECTED: 'Rejetée',
};

const complementaryCertificationLabel = {
  [PIX_EMPLOI_CLEA_V1]: 'CléA Numérique',
  [PIX_EMPLOI_CLEA_V2]: 'CléA Numérique',
  [PIX_EMPLOI_CLEA_V3]: 'CléA Numérique',
  [PIX_DROIT_MAITRE_CERTIF]: 'Pix+ Droit Maître',
  [PIX_DROIT_EXPERT_CERTIF]: 'Pix+ Droit Expert',
};

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Complement... Remove this comment to see the full error message
class ComplementaryCertificationCourseResultsForJuryCertification {
  static statuses = complementaryCertificationStatus;

  static labels = complementaryCertificationLabel;

  acquired: $TSFixMe;
  id: $TSFixMe;
  partnerKey: $TSFixMe;

  constructor({
    id,
    partnerKey,
    acquired
  }: $TSFixMe) {
    this.id = id;
    this.partnerKey = partnerKey;
    this.acquired = acquired;
  }

  get status() {
    return this.acquired ? complementaryCertificationStatus.ACQUIRED : complementaryCertificationStatus.REJECTED;
  }

  get label() {
    return complementaryCertificationLabel[this.partnerKey];
  }
}

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = ComplementaryCertificationCourseResultsForJuryCertification;
