const {
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
} = require('../../domain/models/Badge').keys;

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'CertifiedB... Remove this comment to see the full error message
class CertifiedBadgeImage {
  isTemporaryBadge: $TSFixMe;
  levelName: $TSFixMe;
  message: $TSFixMe;
  path: $TSFixMe;
  constructor({
    path,
    isTemporaryBadge,
    message = null,
    levelName
  }: $TSFixMe) {
    this.path = path;
    this.message = message;
    this.isTemporaryBadge = isTemporaryBadge;
    this.levelName = levelName;
  }

  static finalFromPath(path: $TSFixMe) {
    return new CertifiedBadgeImage({
      path,
      isTemporaryBadge: false,
    });
  }

  static fromPartnerKey(partnerKey: $TSFixMe, isTemporaryBadge: $TSFixMe, imageUrl: $TSFixMe) {
    const badgeKey = partnerKey;

    if (badgeKey === PIX_DROIT_MAITRE_CERTIF || badgeKey === PIX_DROIT_EXPERT_CERTIF) {
      return CertifiedBadgeImage.finalFromPath(imageUrl);
    }

    if (badgeKey === PIX_EDU_FORMATION_INITIALE_2ND_DEGRE_INITIE) {
      const levelName = 'Initié (entrée dans le métier)';
      return new CertifiedBadgeImage({
        path: imageUrl,
        message: _getBadgeMessage(isTemporaryBadge, levelName),
        isTemporaryBadge,
        levelName,
      });
    }

    if (badgeKey === PIX_EDU_FORMATION_INITIALE_1ER_DEGRE_INITIE) {
      const levelName = 'Initié (entrée dans le métier)';
      return new CertifiedBadgeImage({
        path: imageUrl,
        message: _getBadgeMessage(isTemporaryBadge, levelName),
        isTemporaryBadge,
        levelName,
      });
    }

    if (
      [PIX_EDU_FORMATION_INITIALE_2ND_DEGRE_CONFIRME, PIX_EDU_FORMATION_CONTINUE_2ND_DEGRE_CONFIRME].includes(badgeKey)
    ) {
      const levelName = 'Confirmé';
      return new CertifiedBadgeImage({
        path: imageUrl,
        message: _getBadgeMessage(isTemporaryBadge, levelName),
        isTemporaryBadge,
        levelName,
      });
    }

    if (
      [PIX_EDU_FORMATION_INITIALE_1ER_DEGRE_CONFIRME, PIX_EDU_FORMATION_CONTINUE_1ER_DEGRE_CONFIRME].includes(badgeKey)
    ) {
      const levelName = 'Confirmé';
      return new CertifiedBadgeImage({
        path: imageUrl,
        message: _getBadgeMessage(isTemporaryBadge, levelName),
        isTemporaryBadge,
        levelName,
      });
    }

    if (badgeKey === PIX_EDU_FORMATION_CONTINUE_2ND_DEGRE_AVANCE) {
      const levelName = 'Avancé';
      return new CertifiedBadgeImage({
        path: imageUrl,
        message: _getBadgeMessage(isTemporaryBadge, levelName),
        isTemporaryBadge,
        levelName,
      });
    }

    if (badgeKey === PIX_EDU_FORMATION_CONTINUE_1ER_DEGRE_AVANCE) {
      const levelName = 'Avancé';
      return new CertifiedBadgeImage({
        path: imageUrl,
        message: _getBadgeMessage(isTemporaryBadge, levelName),
        isTemporaryBadge,
        levelName,
      });
    }

    if (badgeKey === PIX_EDU_FORMATION_CONTINUE_2ND_DEGRE_EXPERT) {
      const levelName = 'Expert';
      return new CertifiedBadgeImage({
        path: imageUrl,
        message: _getBadgeMessage(isTemporaryBadge, levelName),
        isTemporaryBadge,
        levelName,
      });
    }

    if (badgeKey === PIX_EDU_FORMATION_CONTINUE_1ER_DEGRE_EXPERT) {
      const levelName = 'Expert';
      return new CertifiedBadgeImage({
        path: imageUrl,
        message: _getBadgeMessage(isTemporaryBadge, levelName),
        isTemporaryBadge,
        levelName,
      });
    }
  }
}

function _getBadgeMessage(isTemporaryBadge: $TSFixMe, levelName: $TSFixMe) {
  return isTemporaryBadge
    ? `Vous avez obtenu le niveau “${levelName}” dans le cadre du volet 1 de la certification Pix+Édu. Votre niveau final sera déterminé à l’issue du volet 2`
    : `Vous avez obtenu la certification Pix+Edu niveau "${levelName}"`;
}

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = CertifiedBadgeImage;
