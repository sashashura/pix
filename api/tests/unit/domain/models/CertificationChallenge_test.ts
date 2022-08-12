// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect } = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Certificat... Remove this comment to see the full error message
const CertificationChallenge = require('../../../../lib/domain/models/CertificationChallenge');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Domain | Models | CertificationChallenge', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#static createForPixCertification', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should build a certificationChallenge for pix certification', function () {
      // given
      const associatedSkillName = '@faireDesOrigamis1';
      const associatedSkillId = 'recOrigami1';
      const challengeId = 'recChallABC';
      const competenceId = 'recCompDEF';

      // when
      const certificationChallenge = CertificationChallenge.createForPixCertification({
        associatedSkillName,
        associatedSkillId,
        challengeId,
        competenceId,
      });

      // then
      const expectedCertificationChallenge = new CertificationChallenge({
        id: undefined,
        courseId: undefined,
        associatedSkillName,
        associatedSkillId,
        challengeId,
        competenceId,
        isNeutralized: false,
        certifiableBadgeKey: null,
      });
      expect(certificationChallenge).to.deep.equal(expectedCertificationChallenge);
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#static createForPixPlusCertification', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should build a certificationChallenge for pix certification', function () {
      // given
      const associatedSkillName = '@faireDesOrigamis1';
      const associatedSkillId = 'recOrigami1';
      const challengeId = 'recChallABC';
      const competenceId = 'recCompDEF';
      const certifiableBadgeKey = 'BADGE_MANGUE';

      // when
      const certificationChallenge = CertificationChallenge.createForPixPlusCertification({
        associatedSkillName,
        associatedSkillId,
        challengeId,
        competenceId,
        certifiableBadgeKey,
      });

      // then
      const expectedCertificationChallenge = new CertificationChallenge({
        id: undefined,
        courseId: undefined,
        associatedSkillName,
        associatedSkillId,
        challengeId,
        competenceId,
        isNeutralized: false,
        certifiableBadgeKey,
      });
      expect(certificationChallenge).to.deep.equal(expectedCertificationChallenge);
    });
  });
});
