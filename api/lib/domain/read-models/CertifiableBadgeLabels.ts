const {
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'PIX_EMPLOI... Remove this comment to see the full error message
  PIX_EMPLOI_CLEA_V1,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'PIX_EMPLOI... Remove this comment to see the full error message
  PIX_EMPLOI_CLEA_V2,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'PIX_EMPLOI... Remove this comment to see the full error message
  PIX_EMPLOI_CLEA_V3,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'PIX_DROIT_... Remove this comment to see the full error message
  PIX_DROIT_MAITRE_CERTIF,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'PIX_DROIT_... Remove this comment to see the full error message
  PIX_DROIT_EXPERT_CERTIF,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'PIX_EDU_FO... Remove this comment to see the full error message
  PIX_EDU_FORMATION_INITIALE_2ND_DEGRE_INITIE,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'PIX_EDU_FO... Remove this comment to see the full error message
  PIX_EDU_FORMATION_INITIALE_2ND_DEGRE_CONFIRME,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'PIX_EDU_FO... Remove this comment to see the full error message
  PIX_EDU_FORMATION_CONTINUE_2ND_DEGRE_CONFIRME,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'PIX_EDU_FO... Remove this comment to see the full error message
  PIX_EDU_FORMATION_CONTINUE_2ND_DEGRE_AVANCE,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'PIX_EDU_FO... Remove this comment to see the full error message
  PIX_EDU_FORMATION_CONTINUE_2ND_DEGRE_EXPERT,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'PIX_EDU_FO... Remove this comment to see the full error message
  PIX_EDU_FORMATION_INITIALE_1ER_DEGRE_INITIE,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'PIX_EDU_FO... Remove this comment to see the full error message
  PIX_EDU_FORMATION_INITIALE_1ER_DEGRE_CONFIRME,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'PIX_EDU_FO... Remove this comment to see the full error message
  PIX_EDU_FORMATION_CONTINUE_1ER_DEGRE_CONFIRME,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'PIX_EDU_FO... Remove this comment to see the full error message
  PIX_EDU_FORMATION_CONTINUE_1ER_DEGRE_AVANCE,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'PIX_EDU_FO... Remove this comment to see the full error message
  PIX_EDU_FORMATION_CONTINUE_1ER_DEGRE_EXPERT,
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
} = require('../models/Badge').keys;

const certifiableBadgeLabels = {
  [PIX_EMPLOI_CLEA_V1]: 'CléA Numérique',
  [PIX_EMPLOI_CLEA_V2]: 'CléA Numérique',
  [PIX_EMPLOI_CLEA_V3]: 'CléA Numérique',
  [PIX_DROIT_MAITRE_CERTIF]: 'Pix+ Droit Maître',
  [PIX_DROIT_EXPERT_CERTIF]: 'Pix+ Droit Expert',
  [PIX_EDU_FORMATION_INITIALE_2ND_DEGRE_INITIE]: 'Pix+ Édu 2nd degré Initié (entrée dans le métier)',
  [PIX_EDU_FORMATION_INITIALE_2ND_DEGRE_CONFIRME]: 'Pix+ Édu 2nd degré Confirmé',
  [PIX_EDU_FORMATION_CONTINUE_2ND_DEGRE_CONFIRME]: 'Pix+ Édu 2nd degré Confirmé',
  [PIX_EDU_FORMATION_CONTINUE_2ND_DEGRE_AVANCE]: 'Pix+ Édu 2nd degré Avancé',
  [PIX_EDU_FORMATION_CONTINUE_2ND_DEGRE_EXPERT]: 'Pix+ Édu 2nd degré Expert',
  [PIX_EDU_FORMATION_INITIALE_1ER_DEGRE_INITIE]: 'Pix+ Édu 1er degré Initié (entrée dans le métier)',
  [PIX_EDU_FORMATION_INITIALE_1ER_DEGRE_CONFIRME]: 'Pix+ Édu 1er degré Confirmé',
  [PIX_EDU_FORMATION_CONTINUE_1ER_DEGRE_CONFIRME]: 'Pix+ Édu 1er degré Confirmé',
  [PIX_EDU_FORMATION_CONTINUE_1ER_DEGRE_AVANCE]: 'Pix+ Édu 1er degré Avancé',
  [PIX_EDU_FORMATION_CONTINUE_1ER_DEGRE_EXPERT]: 'Pix+ Édu 1er degré Expert',
};

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Certifiabl... Remove this comment to see the full error message
class CertifiableBadgeLabels {
static labels = certifiableBadgeLabels;

  static getLabelByBadgeKey(badgeKey: $TSFixMe) {
    return certifiableBadgeLabels[badgeKey];
  }

  static getCleaLabel() {
    return certifiableBadgeLabels[PIX_EMPLOI_CLEA_V1];
  }
}

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = CertifiableBadgeLabels;
