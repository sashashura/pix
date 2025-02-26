const { expect } = require('../../../test-helper');
const CertifiedBadgeImage = require('../../../../lib/domain/read-models/CertifiedBadgeImage');
const {
  PIX_DROIT_MAITRE_CERTIF,
  PIX_DROIT_EXPERT_CERTIF,
  PIX_EDU_FORMATION_INITIALE_2ND_DEGRE_INITIE,
  PIX_EDU_FORMATION_INITIALE_2ND_DEGRE_CONFIRME,
  PIX_EDU_FORMATION_CONTINUE_2ND_DEGRE_CONFIRME,
  PIX_EDU_FORMATION_CONTINUE_2ND_DEGRE_AVANCE,
  PIX_EDU_FORMATION_CONTINUE_2ND_DEGRE_EXPERT,
  PIX_EDU_FORMATION_INITIALE_1ER_DEGRE_INITIE,
  PIX_EDU_FORMATION_INITIALE_1ER_DEGRE_CONFIRME,
  PIX_EDU_FORMATION_CONTINUE_1ER_DEGRE_CONFIRME,
  PIX_EDU_FORMATION_CONTINUE_1ER_DEGRE_AVANCE,
  PIX_EDU_FORMATION_CONTINUE_1ER_DEGRE_EXPERT,
} = require('../../../../lib/domain/models/Badge').keys;

const pixPlusDroitBadgesInfos = {
  [PIX_DROIT_MAITRE_CERTIF]: {
    path: 'https://images.pix.fr/badges-certifies/pix-droit/maitre.svg',
  },
  [PIX_DROIT_EXPERT_CERTIF]: {
    path: 'https://images.pix.fr/badges-certifies/pix-droit/expert.svg',
  },
};

const pixPlusEdu2ndDegreBadgesInfos = {
  [PIX_EDU_FORMATION_INITIALE_2ND_DEGRE_INITIE]: {
    path: 'https://images.pix.fr/badges/Pix_plus_Edu-1-Initie-certif.svg',
    levelName: 'Initié (entrée dans le métier)',
  },
  [PIX_EDU_FORMATION_INITIALE_2ND_DEGRE_CONFIRME]: {
    path: 'https://images.pix.fr/badges/Pix_plus_Edu-2-Confirme-certif.svg',
    levelName: 'Confirmé',
  },
  [PIX_EDU_FORMATION_CONTINUE_2ND_DEGRE_CONFIRME]: {
    path: 'https://images.pix.fr/badges/Pix_plus_Edu-2-Confirme-certif.svg',
    levelName: 'Confirmé',
  },
  [PIX_EDU_FORMATION_CONTINUE_2ND_DEGRE_AVANCE]: {
    path: 'https://images.pix.fr/badges/Pix_plus_Edu-3-Avance-certif.svg',
    levelName: 'Avancé',
  },
  [PIX_EDU_FORMATION_CONTINUE_2ND_DEGRE_EXPERT]: {
    path: 'https://images.pix.fr/badges/Pix_plus_Edu-4-Expert-certif.svg',
    levelName: 'Expert',
  },
};

const pixPlusEdu1erDegreBadgesInfos = {
  [PIX_EDU_FORMATION_INITIALE_1ER_DEGRE_INITIE]: {
    path: 'https://images.pix.fr/badges/Pix_plus_Edu-certif-Autonome_PREMIER-DEGRE.svg',
    levelName: 'Initié (entrée dans le métier)',
  },
  [PIX_EDU_FORMATION_INITIALE_1ER_DEGRE_CONFIRME]: {
    path: 'https://images.pix.fr/badges/Pix_plus_Edu-certif-confirme_PREMIER-DEGRE.svg',
    levelName: 'Confirmé',
  },
  [PIX_EDU_FORMATION_CONTINUE_1ER_DEGRE_CONFIRME]: {
    path: 'https://images.pix.fr/badges/Pix_plus_Edu-certif-confirme_PREMIER-DEGRE.svg',
    levelName: 'Confirmé',
  },
  [PIX_EDU_FORMATION_CONTINUE_1ER_DEGRE_AVANCE]: {
    path: 'https://images.pix.fr/badges/Pix_plus_Edu-certif-avance_PREMIER-DEGRE.svg',
    levelName: 'Avancé',
  },
  [PIX_EDU_FORMATION_CONTINUE_1ER_DEGRE_EXPERT]: {
    path: 'https://images.pix.fr/badges/Pix_plus_Edu-certif-Expert_PREMIER-DEGRE.svg',
    levelName: 'Expert',
  },
};

describe('Unit | Domain | Models | CertifiedBadgeImage', function () {
  describe('#fromPartnerKey', function () {
    context('when badge is Pix+Edu', function () {
      context('when badge is temporary', function () {
        // given
        const badges = { ...pixPlusEdu2ndDegreBadgesInfos, ...pixPlusEdu1erDegreBadgesInfos };

        for (const badgeKey in badges) {
          it(`returns temporary badge image for "PIX" source ${badgeKey}`, function () {
            // when
            const isTemporaryBadge = true;
            const result = CertifiedBadgeImage.fromPartnerKey(badgeKey, isTemporaryBadge, badges[badgeKey].path);

            // then
            const { path, levelName } = badges[badgeKey];

            expect(result).to.deepEqualInstance(
              new CertifiedBadgeImage({
                path,
                levelName,
                isTemporaryBadge,
                message: `Vous avez obtenu le niveau “${levelName}” dans le cadre du volet 1 de la certification Pix+Édu. Votre niveau final sera déterminé à l’issue du volet 2`,
              })
            );
          });
        }
      });

      context('when badge is final', function () {
        // given
        const badges = {
          ...pixPlusEdu2ndDegreBadgesInfos,
          ...pixPlusEdu1erDegreBadgesInfos,
        };

        for (const badgeKey in badges) {
          it(`returns final badge image for partner key ${badgeKey}`, function () {
            // when
            const isTemporaryBadge = false;
            const result = CertifiedBadgeImage.fromPartnerKey(badgeKey, isTemporaryBadge, badges[badgeKey].path);

            // then
            const { path, levelName } = badges[badgeKey];

            expect(result).to.deepEqualInstance(
              new CertifiedBadgeImage({
                path,
                levelName,
                isTemporaryBadge,
                message: `Vous avez obtenu la certification Pix+Edu niveau "${levelName}"`,
              })
            );
          });
        }
      });
    });

    context('when badge is not Pix+Edu', function () {
      // given
      const badges = {
        ...pixPlusDroitBadgesInfos,
      };

      for (const badgeKey in badges) {
        it(`returns final badge image for partner key ${badgeKey}`, function () {
          // when
          const isTemporaryBadge = false;
          const result = CertifiedBadgeImage.fromPartnerKey(badgeKey, isTemporaryBadge, badges[badgeKey].path);

          // then
          const { path, levelName } = badges[badgeKey];

          expect(result).to.deepEqualInstance(
            new CertifiedBadgeImage({
              path,
              levelName,
              isTemporaryBadge,
              message: null,
            })
          );
        });
      }
    });
  });
});
