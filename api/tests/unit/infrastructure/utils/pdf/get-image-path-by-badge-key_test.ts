// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect } = require('../../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'getImagePa... Remove this comment to see the full error message
const getImagePathByBadgeKey = require('../../../../../lib/infrastructure/utils/pdf/get-image-path-by-badge-key');
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
} = require('../../../../../lib/domain/models/Badge').keys;

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Utils | get-image-path-by-badge-key', function () {
  // eslint-disable-next-line mocha/no-setup-in-describe
  [
    { badge: PIX_EMPLOI_CLEA_V1, path: '/files/stickers/macaron_clea.pdf' },
    { badge: PIX_EMPLOI_CLEA_V2, path: '/files/stickers/macaron_clea.pdf' },
    { badge: PIX_EMPLOI_CLEA_V3, path: '/files/stickers/macaron_clea.pdf' },
    { badge: PIX_DROIT_MAITRE_CERTIF, path: '/files/stickers/macaron_droit_maitre.pdf' },
    { badge: PIX_DROIT_EXPERT_CERTIF, path: '/files/stickers/macaron_droit_expert.pdf' },
    { badge: PIX_EDU_FORMATION_INITIALE_2ND_DEGRE_INITIE, path: '/files/stickers/macaron_edu_2nd_initie.pdf' },
    { badge: PIX_EDU_FORMATION_INITIALE_2ND_DEGRE_CONFIRME, path: '/files/stickers/macaron_edu_2nd_confirme.pdf' },
    { badge: PIX_EDU_FORMATION_CONTINUE_2ND_DEGRE_CONFIRME, path: '/files/stickers/macaron_edu_2nd_confirme.pdf' },
    { badge: PIX_EDU_FORMATION_CONTINUE_2ND_DEGRE_AVANCE, path: '/files/stickers/macaron_edu_2nd_avance.pdf' },
    { badge: PIX_EDU_FORMATION_CONTINUE_2ND_DEGRE_EXPERT, path: '/files/stickers/macaron_edu_2nd_expert.pdf' },
    { badge: PIX_EDU_FORMATION_INITIALE_1ER_DEGRE_INITIE, path: '/files/stickers/macaron_edu_1er_initie.pdf' },
    { badge: PIX_EDU_FORMATION_INITIALE_1ER_DEGRE_CONFIRME, path: '/files/stickers/macaron_edu_1er_confirme.pdf' },
    { badge: PIX_EDU_FORMATION_CONTINUE_1ER_DEGRE_CONFIRME, path: '/files/stickers/macaron_edu_1er_confirme.pdf' },
    { badge: PIX_EDU_FORMATION_CONTINUE_1ER_DEGRE_AVANCE, path: '/files/stickers/macaron_edu_1er_avance.pdf' },
    { badge: PIX_EDU_FORMATION_CONTINUE_1ER_DEGRE_EXPERT, path: '/files/stickers/macaron_edu_1er_expert.pdf' },
  ].forEach(({ badge, path }) => {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it(`should return the path ${path} for the badge ${badge}`, function () {
      // when
      const result = getImagePathByBadgeKey(badge);

      // then
      expect(result).to.include(path);
    });
  });
});
