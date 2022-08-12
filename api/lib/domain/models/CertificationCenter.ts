const {
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'PIX_PLUS_D... Remove this comment to see the full error message
  PIX_PLUS_DROIT,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'CLEA'.
  CLEA,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'PIX_PLUS_E... Remove this comment to see the full error message
  PIX_PLUS_EDU_1ER_DEGRE,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'PIX_PLUS_E... Remove this comment to see the full error message
  PIX_PLUS_EDU_2ND_DEGRE,
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
} = require('./ComplementaryCertification');

const SUP = 'SUP';
const SCO = 'SCO';
const PRO = 'PRO';

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'types'.
const types = {
  SUP,
  SCO,
  PRO,
};

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Certificat... Remove this comment to see the full error message
class CertificationCenter {
  createdAt: $TSFixMe;
  externalId: $TSFixMe;
  habilitations: $TSFixMe;
  id: $TSFixMe;
  isSupervisorAccessEnabled: $TSFixMe;
  name: $TSFixMe;
  type: $TSFixMe;
  updatedAt: $TSFixMe;
  constructor({
    id,
    name,
    externalId,
    type,
    createdAt,
    updatedAt,
    habilitations = [],
    isSupervisorAccessEnabled = false
  }: $TSFixMe = {}) {
    this.id = id;
    this.name = name;
    this.externalId = externalId;
    this.type = type;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.habilitations = habilitations;
    this.isSupervisorAccessEnabled = isSupervisorAccessEnabled;
  }

  get isSco() {
    return this.type === types.SCO;
  }

  get isHabilitatedPixPlusDroit() {
    return this.habilitations.some((habilitation: $TSFixMe) => habilitation.key === PIX_PLUS_DROIT);
  }

  get isHabilitatedPixPlusEdu1erDegre() {
    return this.habilitations.some((habilitation: $TSFixMe) => habilitation.key === PIX_PLUS_EDU_1ER_DEGRE);
  }

  get isHabilitatedPixPlusEdu2ndDegre() {
    return this.habilitations.some((habilitation: $TSFixMe) => habilitation.key === PIX_PLUS_EDU_2ND_DEGRE);
  }

  get isHabilitatedClea() {
    return this.habilitations.some((habilitation: $TSFixMe) => habilitation.key === CLEA);
  }
}

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = CertificationCenter;
// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports.types = types;
