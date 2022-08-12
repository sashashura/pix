// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Complement... Remove this comment to see the full error message
const ComplementaryCertificationCourseResult = require('../../../../lib/domain/models/ComplementaryCertificationCourseResult');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, domainBuilder } = require('../../../test-helper');
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
} = require('../../../../lib/domain/models/Badge').keys;

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Domain | Models | CertificationAttestation', function () {
  // @ts-expect-error TS(2304): Cannot find name 'context'.
  context('#setResultCompetenceTree', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should set the resultCompetenceTree on CertificationAttestation model', function () {
      // given
      const resultCompetenceTree = domainBuilder.buildResultCompetenceTree({ id: 'someId' });
      const certificationAttestation = domainBuilder.buildCertificationAttestation();

      // when
      certificationAttestation.setResultCompetenceTree(resultCompetenceTree);

      // expect
      expect(certificationAttestation.resultCompetenceTree).to.deep.equal(resultCompetenceTree);
    });
  });

  // @ts-expect-error TS(2304): Cannot find name 'context'.
  context('#getAcquiredCleaCertification', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return the acquired PIX_EMPLOI_CLEA_V1 badge', function () {
      // given
      const certificationAttestation = domainBuilder.buildCertificationAttestation({
        certifiedBadges: [{ partnerKey: 'OTHER_BADGE' }, { partnerKey: PIX_EMPLOI_CLEA_V1 }],
      });

      // when
      const acquiredCleaCertification = certificationAttestation.getAcquiredCleaCertification();

      // expect
      expect(acquiredCleaCertification).to.deep.equal(PIX_EMPLOI_CLEA_V1);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return the acquired PIX_EMPLOI_CLEA_V2 badge', function () {
      // given
      const certificationAttestation = domainBuilder.buildCertificationAttestation({
        certifiedBadges: [{ partnerKey: 'OTHER_BADGE' }, { partnerKey: PIX_EMPLOI_CLEA_V2 }],
      });

      // when
      const acquiredCleaCertification = certificationAttestation.getAcquiredCleaCertification();

      // expect
      expect(acquiredCleaCertification).to.deep.equal(PIX_EMPLOI_CLEA_V2);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return the acquired PIX_EMPLOI_CLEA_V3 badge', function () {
      // given
      const certificationAttestation = domainBuilder.buildCertificationAttestation({
        certifiedBadges: [{ partnerKey: 'OTHER_BADGE' }, { partnerKey: PIX_EMPLOI_CLEA_V3 }],
      });

      // when
      const acquiredCleaCertification = certificationAttestation.getAcquiredCleaCertification();

      // expect
      expect(acquiredCleaCertification).to.deep.equal(PIX_EMPLOI_CLEA_V3);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return undefined if no clea badge has been acquired', function () {
      // given
      const certificationAttestation = domainBuilder.buildCertificationAttestation({
        certifiedBadges: [{ partnerKey: 'OTHER_BADGE_1' }, { partnerKey: 'OTHER_BADGE_2' }],
      });

      // when
      const acquiredCleaCertification = certificationAttestation.getAcquiredCleaCertification();

      // expect
      expect(acquiredCleaCertification).to.be.undefined;
    });
  });

  // @ts-expect-error TS(2304): Cannot find name 'context'.
  context('#getAcquiredPixPlusDroitCertification', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return the acquired PIX_DROIT_MAITRE_CERTIF badge', function () {
      // given
      const certificationAttestation = domainBuilder.buildCertificationAttestation({
        certifiedBadges: [{ partnerKey: 'OTHER_BADGE' }, { partnerKey: PIX_DROIT_MAITRE_CERTIF }],
      });

      // when
      const acquiredPixPlusDroitCertification = certificationAttestation.getAcquiredPixPlusDroitCertification();

      // expect
      expect(acquiredPixPlusDroitCertification).to.deep.equal(PIX_DROIT_MAITRE_CERTIF);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return the acquired PIX_DROIT_EXPERT_CERTIF badge', function () {
      // given
      const certificationAttestation = domainBuilder.buildCertificationAttestation({
        certifiedBadges: [{ partnerKey: 'OTHER_BADGE' }, { partnerKey: PIX_DROIT_EXPERT_CERTIF }],
      });

      // when
      const acquiredPixPlusDroitCertification = certificationAttestation.getAcquiredPixPlusDroitCertification();

      // expect
      expect(acquiredPixPlusDroitCertification).to.deep.equal(PIX_DROIT_EXPERT_CERTIF);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return undefined if no Pix+ Droit badge has been acquired', function () {
      // given
      const certificationAttestation = domainBuilder.buildCertificationAttestation({
        certifiedBadges: [{ partnerKey: 'OTHER_BADGE_1' }, { partnerKey: 'OTHER_BADGE_2' }],
      });

      // when
      const acquiredPixPlusDroitCertification = certificationAttestation.getAcquiredPixPlusDroitCertification();

      // expect
      expect(acquiredPixPlusDroitCertification).to.be.undefined;
    });
  });

  // @ts-expect-error TS(2304): Cannot find name 'context'.
  context('#getAcquiredPixPlusEduCertification', function () {
    // eslint-disable-next-line mocha/no-setup-in-describe
    [
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
    ].forEach((badgeKey) => {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it(`should return the acquired ${badgeKey} badge`, function () {
        // given
        const certificationAttestation = domainBuilder.buildCertificationAttestation({
          certifiedBadges: [
            { partnerKey: 'OTHER_BADGE' },
            { partnerKey: badgeKey, source: ComplementaryCertificationCourseResult.sources.PIX },
          ],
        });

        // when
        const acquiredPixPlusEduCertification = certificationAttestation.getAcquiredPixPlusEduCertification();

        // expect
        expect(acquiredPixPlusEduCertification).to.deep.equal({
          partnerKey: badgeKey,
          source: ComplementaryCertificationCourseResult.sources.PIX,
        });
      });
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return undefined if no Pix+ Edu badge has been acquired', function () {
      // given
      const certificationAttestation = domainBuilder.buildCertificationAttestation({
        certifiedBadges: ['OTHER_BADGE_1', 'OTHER_BADGE_2'],
      });

      // when
      const acquiredPixPlusEduCertification = certificationAttestation.getAcquiredPixPlusEduCertification();

      // expect
      expect(acquiredPixPlusEduCertification).to.be.undefined;
    });
  });

  // @ts-expect-error TS(2304): Cannot find name 'context'.
  context('#getPixPlusEduBadgeDisplayName', function () {
    // eslint-disable-next-line mocha/no-setup-in-describe
    [
      {
        badgeKey: PIX_EDU_FORMATION_INITIALE_2ND_DEGRE_INITIE,
        expectedDisplayName: 'Initié (entrée dans le métier)',
      },
      { badgeKey: PIX_EDU_FORMATION_INITIALE_2ND_DEGRE_CONFIRME, expectedDisplayName: 'Confirmé' },
      { badgeKey: PIX_EDU_FORMATION_CONTINUE_2ND_DEGRE_CONFIRME, expectedDisplayName: 'Confirmé' },
      { badgeKey: PIX_EDU_FORMATION_CONTINUE_2ND_DEGRE_AVANCE, expectedDisplayName: 'Avancé' },
      { badgeKey: PIX_EDU_FORMATION_CONTINUE_2ND_DEGRE_EXPERT, expectedDisplayName: 'Expert' },
      { badgeKey: PIX_EDU_FORMATION_INITIALE_1ER_DEGRE_INITIE, expectedDisplayName: 'Initié (entrée dans le métier)' },
      { badgeKey: PIX_EDU_FORMATION_INITIALE_1ER_DEGRE_CONFIRME, expectedDisplayName: 'Confirmé' },
      { badgeKey: PIX_EDU_FORMATION_CONTINUE_1ER_DEGRE_CONFIRME, expectedDisplayName: 'Confirmé' },
      { badgeKey: PIX_EDU_FORMATION_CONTINUE_1ER_DEGRE_AVANCE, expectedDisplayName: 'Avancé' },
      { badgeKey: PIX_EDU_FORMATION_CONTINUE_1ER_DEGRE_EXPERT, expectedDisplayName: 'Expert' },
    ].forEach(({ badgeKey, expectedDisplayName }) => {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it(`should return ${expectedDisplayName} for badge key ${badgeKey}`, function () {
        // given
        const certificationAttestation = domainBuilder.buildCertificationAttestation({
          certifiedBadges: [{ partnerKey: badgeKey }],
        });

        // when
        const result = certificationAttestation.getPixPlusEduBadgeDisplayName();

        // then
        expect(result).to.equal(expectedDisplayName);
      });
    });
  });

  // @ts-expect-error TS(2304): Cannot find name 'context'.
  context('#hasAcquiredAnyComplementaryCertifications', function () {
    // eslint-disable-next-line mocha/no-setup-in-describe
    [
      PIX_EMPLOI_CLEA_V1,
      PIX_EMPLOI_CLEA_V2,
      PIX_EMPLOI_CLEA_V3,
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
    ].forEach((key) =>
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return true if certified badge images for attestation is not empty', function () {
        // given
        const certificationAttestation = domainBuilder.buildCertificationAttestation({
          certifiedBadges: [key],
        });

        // when
        const hasAcquiredAnyComplementaryCertifications =
          certificationAttestation.hasAcquiredAnyComplementaryCertifications();

        // expect
        expect(hasAcquiredAnyComplementaryCertifications).to.be.true;
      })
    );

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return false if certified badge images for attestation is empty', function () {
      // given
      const certificationAttestation = domainBuilder.buildCertificationAttestation({
        certifiedBadges: [],
      });

      // when
      const hasAcquiredAnyComplementaryCertifications =
        certificationAttestation.hasAcquiredAnyComplementaryCertifications();

      // expect
      expect(hasAcquiredAnyComplementaryCertifications).to.be.false;
    });
  });
});
