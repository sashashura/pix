// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Certificat... Remove this comment to see the full error message
const CertificationAssessmentScore = require('../../../../lib/domain/models/CertificationAssessmentScore');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, domainBuilder } = require('../../../test-helper');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Domain | Models | CertificationAssessmentScore', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#get nbPix', function () {
    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when CertificationAssessmentScore has no competence marks', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return nbPix 0', function () {
        // given
        const certificationAssessmentScore = domainBuilder.buildCertificationAssessmentScore({
          competenceMarks: [],
        });

        // when
        const actualNbPix = certificationAssessmentScore.nbPix;

        // then
        expect(actualNbPix).to.equal(0);
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when CertificationAssessmentScore has competence marks', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return the sum of the competence marks score as nbPix', function () {
        // given
        const competenceMark1 = domainBuilder.buildCompetenceMark({
          score: 13,
        });
        const competenceMark2 = domainBuilder.buildCompetenceMark({
          score: 12,
        });
        const certificationAssessmentScore = domainBuilder.buildCertificationAssessmentScore({
          competenceMarks: [competenceMark1, competenceMark2],
        });

        // when
        const actualNbPix = certificationAssessmentScore.nbPix;

        // then
        expect(actualNbPix).to.equal(25);
      });
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#get status', function () {
    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when nbPix is 0', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return REJECTED as status', function () {
        // given
        const certificationAssessmentScore = domainBuilder.buildCertificationAssessmentScore({
          competenceMarks: [],
        });

        // when
        const status = certificationAssessmentScore.status;

        // then
expect(status).to.equal((CertificationAssessmentScore as $TSFixMe).statuses.REJECTED);
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when nbPix is greater than 0', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return VALIDATED as status', function () {
        // given
        const competenceMark = domainBuilder.buildCompetenceMark({
          score: 13,
        });
        const certificationAssessmentScore = domainBuilder.buildCertificationAssessmentScore({
          competenceMarks: [competenceMark],
        });

        // when
        const actualStatus = certificationAssessmentScore.status;

        // then
expect(actualStatus).to.equal((CertificationAssessmentScore as $TSFixMe).statuses.VALIDATED);
      });
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#getCompetenceMarks', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return the competence marks collection', function () {
      // given
      const competenceMark1 = domainBuilder.buildCompetenceMark({
        score: 13,
      });
      const competenceMark2 = domainBuilder.buildCompetenceMark({
        score: 12,
      });
      const certificationAssessmentScore = domainBuilder.buildCertificationAssessmentScore({
        competenceMarks: [competenceMark1, competenceMark2],
      });

      // when
      const competenceMarks = certificationAssessmentScore.getCompetenceMarks();

      // then
      expect(competenceMarks).to.deep.equal([competenceMark1, competenceMark2]);
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#getPercentageCorrectAnswers', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return the percentageCorrectAnswers', function () {
      // given
      const certificationAssessmentScore = domainBuilder.buildCertificationAssessmentScore({
        percentageCorrectAnswers: 55,
      });

      // when
      const percentageCorrectAnswers = certificationAssessmentScore.getPercentageCorrectAnswers();

      // then
      expect(percentageCorrectAnswers).to.equal(55);
    });
  });
});
