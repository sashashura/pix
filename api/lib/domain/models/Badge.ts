// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Badge'.
class Badge {
  static keys = {
      PIX_EMPLOI_CLEA_V1: 'PIX_EMPLOI_CLEA',
      PIX_EMPLOI_CLEA_V2: 'PIX_EMPLOI_CLEA_V2',
      PIX_EMPLOI_CLEA_V3: 'PIX_EMPLOI_CLEA_V3',
      PIX_DROIT_MAITRE_CERTIF: 'PIX_DROIT_MAITRE_CERTIF',
      PIX_DROIT_EXPERT_CERTIF: 'PIX_DROIT_EXPERT_CERTIF',
      PIX_EDU_FORMATION_INITIALE_2ND_DEGRE_INITIE: 'PIX_EDU_FORMATION_INITIALE_2ND_DEGRE_INITIE',
      PIX_EDU_FORMATION_INITIALE_2ND_DEGRE_CONFIRME: 'PIX_EDU_FORMATION_INITIALE_2ND_DEGRE_CONFIRME',
      PIX_EDU_FORMATION_CONTINUE_2ND_DEGRE_CONFIRME: 'PIX_EDU_FORMATION_CONTINUE_2ND_DEGRE_CONFIRME',
      PIX_EDU_FORMATION_CONTINUE_2ND_DEGRE_AVANCE: 'PIX_EDU_FORMATION_CONTINUE_2ND_DEGRE_AVANCE',
      PIX_EDU_FORMATION_CONTINUE_2ND_DEGRE_EXPERT: 'PIX_EDU_FORMATION_CONTINUE_2ND_DEGRE_EXPERT',
      PIX_EDU_FORMATION_INITIALE_1ER_DEGRE_INITIE: 'PIX_EDU_FORMATION_INITIALE_1ER_DEGRE_INITIE',
      PIX_EDU_FORMATION_INITIALE_1ER_DEGRE_CONFIRME: 'PIX_EDU_FORMATION_INITIALE_1ER_DEGRE_CONFIRME',
      PIX_EDU_FORMATION_CONTINUE_1ER_DEGRE_CONFIRME: 'PIX_EDU_FORMATION_CONTINUE_1ER_DEGRE_CONFIRME',
      PIX_EDU_FORMATION_CONTINUE_1ER_DEGRE_AVANCE: 'PIX_EDU_FORMATION_CONTINUE_1ER_DEGRE_AVANCE',
      PIX_EDU_FORMATION_CONTINUE_1ER_DEGRE_EXPERT: 'PIX_EDU_FORMATION_CONTINUE_1ER_DEGRE_EXPERT',
  };

  altMessage: $TSFixMe;
  badgeCriteria: $TSFixMe;
  id: $TSFixMe;
  imageUrl: $TSFixMe;
  isAlwaysVisible: $TSFixMe;
  isCertifiable: $TSFixMe;
  key: $TSFixMe;
  message: $TSFixMe;
  skillSets: $TSFixMe;
  targetProfileId: $TSFixMe;
  title: $TSFixMe;

  constructor({
    id,
    key,
    altMessage,
    imageUrl,
    message,
    title,
    isCertifiable,
    badgeCriteria = [],
    skillSets = [],
    targetProfileId,
    isAlwaysVisible = false
  }: $TSFixMe = {}) {
    this.id = id;
    this.altMessage = altMessage;
    this.imageUrl = imageUrl;
    this.message = message;
    this.title = title;
    this.key = key;
    this.isCertifiable = isCertifiable;
    this.badgeCriteria = badgeCriteria;
    this.skillSets = skillSets;
    this.targetProfileId = targetProfileId;
    this.isAlwaysVisible = isAlwaysVisible;
  }
}

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = Badge;
