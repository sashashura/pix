// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'sinon'.
const { sinon, expect, domainBuilder } = require('../../../test-helper');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const getUserCertificationEligibility = require('../../../../lib/domain/usecases/get-user-certification-eligibility');
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
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'PIX_EMPLOI... Remove this comment to see the full error message
  PIX_EMPLOI_CLEA_V2,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'PIX_EMPLOI... Remove this comment to see the full error message
  PIX_EMPLOI_CLEA_V3,
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
} = require('../../../../lib/domain/models/Badge').keys;

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | UseCase | get-user-certification-eligibility', function () {
  let clock: $TSFixMe;
  const now = new Date(2020, 1, 1);

  const placementProfileService = {
    getPlacementProfile: () => undefined,
  };
  const certificationBadgesService = {
    findStillValidBadgeAcquisitions: () => undefined,
  };

  // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
  beforeEach(function () {
    clock = sinon.useFakeTimers(now);
    placementProfileService.getPlacementProfile = sinon.stub();
    certificationBadgesService.findStillValidBadgeAcquisitions = sinon.stub();
  });

  // @ts-expect-error TS(2304): Cannot find name 'afterEach'.
  afterEach(function () {
    clock.restore();
  });

  // @ts-expect-error TS(2304): Cannot find name 'context'.
  context('when pix certification is not eligible', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return the user certification eligibility with not eligible complementary certifications', async function () {
      // given
      const placementProfile = {
        isCertifiable: () => false,
      };
      (placementProfileService.getPlacementProfile as $TSFixMe).withArgs({ userId: 2, limitDate: now }).resolves(placementProfile);
      (certificationBadgesService.findStillValidBadgeAcquisitions as $TSFixMe).throws(new Error('I should not be called'));

      // when
      const certificationEligibility = await getUserCertificationEligibility({
        userId: 2,
        placementProfileService,
        certificationBadgesService,
      });

      // then
      const expectedCertificationEligibility = domainBuilder.buildCertificationEligibility({
        id: 2,
        pixCertificationEligible: false,
      });
      expect(certificationEligibility).to.deep.equal(expectedCertificationEligibility);
    });
  });

  // eslint-disable-next-line mocha/no-setup-in-describe
  [
    { badgeKey: PIX_DROIT_MAITRE_CERTIF, expectedCertifiableBadgeLabel: 'Pix+ Droit Maître' },
    { badgeKey: PIX_DROIT_EXPERT_CERTIF, expectedCertifiableBadgeLabel: 'Pix+ Droit Expert' },
    {
      badgeKey: PIX_EDU_FORMATION_INITIALE_2ND_DEGRE_INITIE,
      expectedCertifiableBadgeLabel: 'Pix+ Édu 2nd degré Initié (entrée dans le métier)',
    },
    {
      badgeKey: PIX_EDU_FORMATION_INITIALE_2ND_DEGRE_CONFIRME,
      expectedCertifiableBadgeLabel: 'Pix+ Édu 2nd degré Confirmé',
    },
    {
      badgeKey: PIX_EDU_FORMATION_CONTINUE_2ND_DEGRE_CONFIRME,
      expectedCertifiableBadgeLabel: 'Pix+ Édu 2nd degré Confirmé',
    },
    {
      badgeKey: PIX_EDU_FORMATION_CONTINUE_2ND_DEGRE_AVANCE,
      expectedCertifiableBadgeLabel: 'Pix+ Édu 2nd degré Avancé',
    },
    {
      badgeKey: PIX_EDU_FORMATION_CONTINUE_2ND_DEGRE_EXPERT,
      expectedCertifiableBadgeLabel: 'Pix+ Édu 2nd degré Expert',
    },
    {
      badgeKey: PIX_EDU_FORMATION_INITIALE_1ER_DEGRE_INITIE,
      expectedCertifiableBadgeLabel: 'Pix+ Édu 1er degré Initié (entrée dans le métier)',
    },
    {
      badgeKey: PIX_EDU_FORMATION_INITIALE_1ER_DEGRE_CONFIRME,
      expectedCertifiableBadgeLabel: 'Pix+ Édu 1er degré Confirmé',
    },
    {
      badgeKey: PIX_EDU_FORMATION_CONTINUE_1ER_DEGRE_CONFIRME,
      expectedCertifiableBadgeLabel: 'Pix+ Édu 1er degré Confirmé',
    },
    {
      badgeKey: PIX_EDU_FORMATION_CONTINUE_1ER_DEGRE_AVANCE,
      expectedCertifiableBadgeLabel: 'Pix+ Édu 1er degré Avancé',
    },
    {
      badgeKey: PIX_EDU_FORMATION_CONTINUE_1ER_DEGRE_EXPERT,
      expectedCertifiableBadgeLabel: 'Pix+ Édu 1er degré Expert',
    },
    {
      badgeKey: PIX_EMPLOI_CLEA_V2,
      expectedCertifiableBadgeLabel: 'CléA Numérique',
    },
    {
      badgeKey: PIX_EMPLOI_CLEA_V3,
      expectedCertifiableBadgeLabel: 'CléA Numérique',
    },
  ].forEach(({ badgeKey, expectedCertifiableBadgeLabel }) => {
    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context(`when ${badgeKey} badge is not acquired`, function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it(`should return the user certification eligibility with not eligible ${badgeKey}`, async function () {
        // given
        const placementProfile = {
          isCertifiable: () => true,
        };
        (placementProfileService.getPlacementProfile as $TSFixMe).withArgs({ userId: 2, limitDate: now }).resolves(placementProfile);
        (certificationBadgesService.findStillValidBadgeAcquisitions as $TSFixMe).resolves([]);

        // when
        const certificationEligibility = await getUserCertificationEligibility({
          userId: 2,
          placementProfileService,
          certificationBadgesService,
        });

        // then
        expect(certificationEligibility.eligibleComplementaryCertifications).to.be.empty;
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context(`when ${badgeKey} badge is acquired`, function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it(`should return the user certification eligibility with eligible ${badgeKey}`, async function () {
        // given
        const placementProfile = {
          isCertifiable: () => true,
        };
        (placementProfileService.getPlacementProfile as $TSFixMe).withArgs({ userId: 2, limitDate: now }).resolves(placementProfile);
        const badgeAcquisition = domainBuilder.buildBadgeAcquisition({
          badge: domainBuilder.buildBadge({
            key: badgeKey,
          }),
        });
        (certificationBadgesService.findStillValidBadgeAcquisitions as $TSFixMe).resolves([badgeAcquisition]);

        // when
        const certificationEligibility = await getUserCertificationEligibility({
          userId: 2,
          placementProfileService,
          certificationBadgesService,
        });

        // then
        expect(certificationEligibility.eligibleComplementaryCertifications).contains(expectedCertifiableBadgeLabel);
      });
    });
  });
});
