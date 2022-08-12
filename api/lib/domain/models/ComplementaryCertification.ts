// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'PIX_PLUS_D... Remove this comment to see the full error message
const PIX_PLUS_DROIT = 'DROIT';
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'CLEA'.
const CLEA = 'CLEA';
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'PIX_PLUS_E... Remove this comment to see the full error message
const PIX_PLUS_EDU_1ER_DEGRE = 'EDU_1ER_DEGRE';
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'PIX_PLUS_E... Remove this comment to see the full error message
const PIX_PLUS_EDU_2ND_DEGRE = 'EDU_2ND_DEGRE';

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Complement... Remove this comment to see the full error message
class ComplementaryCertification {
  static PIX_PLUS_DROIT = PIX_PLUS_DROIT;

  static CLEA = CLEA;

  static PIX_PLUS_EDU_1ER_DEGRE = PIX_PLUS_EDU_1ER_DEGRE;

  static PIX_PLUS_EDU_2ND_DEGRE = PIX_PLUS_EDU_2ND_DEGRE;

  id: $TSFixMe;
  key: $TSFixMe;
  label: $TSFixMe;

  constructor({
    id,
    label,
    key
  }: $TSFixMe) {
    this.id = id;
    this.label = label;
    this.key = key;
  }

  isClea() {
    return this.key === CLEA;
  }

  isPixPlusDroit() {
    return this.key === PIX_PLUS_DROIT;
  }

  isPixPlusEdu1erDegre() {
    return this.key === PIX_PLUS_EDU_1ER_DEGRE;
  }

  isPixPlusEdu2ndDegre() {
    return this.key === PIX_PLUS_EDU_2ND_DEGRE;
  }
}

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = ComplementaryCertification;
