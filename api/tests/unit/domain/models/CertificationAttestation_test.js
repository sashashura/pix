const ComplementaryCertificationCourseResult = require('../../../../lib/domain/models/ComplementaryCertificationCourseResult');
const { expect, domainBuilder } = require('../../../test-helper');
const {
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
} = require('../../../../lib/domain/models/Badge').keys;

describe('Unit | Domain | Models | CertificationAttestation', function () {
  context('#setResultCompetenceTree', function () {
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

  context('#getAcquiredCleaCertification', function () {
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

  context('#getAcquiredPixPlusDroitCertification', function () {
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
