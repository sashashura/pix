// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect } = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Certifiabl... Remove this comment to see the full error message
const CertifiableBadgeLabels = require('../../../../lib/domain/read-models/CertifiableBadgeLabels');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Domain | Models | CertifiableBadgeLabels', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#getComplementaryCertificationLabelByBadgeKey', function () {
    // eslint-disable-next-line mocha/no-setup-in-describe
    [
      {
        badgeKey: 'PIX_EMPLOI_CLEA',
        expectedLabel: 'CléA Numérique',
      },
      {
        badgeKey: 'PIX_EMPLOI_CLEA_V2',
        expectedLabel: 'CléA Numérique',
      },
      {
        badgeKey: 'PIX_EMPLOI_CLEA_V3',
        expectedLabel: 'CléA Numérique',
      },
      {
        badgeKey: 'PIX_DROIT_MAITRE_CERTIF',
        expectedLabel: 'Pix+ Droit Maître',
      },
      {
        badgeKey: 'PIX_DROIT_EXPERT_CERTIF',
        expectedLabel: 'Pix+ Droit Expert',
      },
      {
        badgeKey: 'PIX_EDU_FORMATION_INITIALE_2ND_DEGRE_INITIE',
        expectedLabel: 'Pix+ Édu 2nd degré Initié (entrée dans le métier)',
      },
      {
        badgeKey: 'PIX_EDU_FORMATION_INITIALE_2ND_DEGRE_CONFIRME',
        expectedLabel: 'Pix+ Édu 2nd degré Confirmé',
      },
      {
        badgeKey: 'PIX_EDU_FORMATION_CONTINUE_2ND_DEGRE_CONFIRME',
        expectedLabel: 'Pix+ Édu 2nd degré Confirmé',
      },
      {
        badgeKey: 'PIX_EDU_FORMATION_CONTINUE_2ND_DEGRE_AVANCE',
        expectedLabel: 'Pix+ Édu 2nd degré Avancé',
      },
      {
        badgeKey: 'PIX_EDU_FORMATION_CONTINUE_2ND_DEGRE_EXPERT',
        expectedLabel: 'Pix+ Édu 2nd degré Expert',
      },
      {
        badgeKey: 'PIX_EDU_FORMATION_INITIALE_1ER_DEGRE_INITIE',
        expectedLabel: 'Pix+ Édu 1er degré Initié (entrée dans le métier)',
      },
      {
        badgeKey: 'PIX_EDU_FORMATION_INITIALE_1ER_DEGRE_CONFIRME',
        expectedLabel: 'Pix+ Édu 1er degré Confirmé',
      },
      {
        badgeKey: 'PIX_EDU_FORMATION_CONTINUE_1ER_DEGRE_CONFIRME',
        expectedLabel: 'Pix+ Édu 1er degré Confirmé',
      },
      {
        badgeKey: 'PIX_EDU_FORMATION_CONTINUE_1ER_DEGRE_AVANCE',
        expectedLabel: 'Pix+ Édu 1er degré Avancé',
      },
      {
        badgeKey: 'PIX_EDU_FORMATION_CONTINUE_1ER_DEGRE_EXPERT',
        expectedLabel: 'Pix+ Édu 1er degré Expert',
      },
    ].forEach(({ badgeKey, expectedLabel }) => {
      // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
      describe(`when badgeKey is ${badgeKey}`, function () {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it(`should return the label "${expectedLabel}"`, function () {
          // when
          const label = CertifiableBadgeLabels.getLabelByBadgeKey(badgeKey);

          // then
          expect(label).to.equal(expectedLabel);
        });
      });
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#getCleaLabel', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('returns CleA label', function () {
      // when
      const label = CertifiableBadgeLabels.getCleaLabel();

      // then
      expect(label).to.equal('CléA Numérique');
    });
  });
});
