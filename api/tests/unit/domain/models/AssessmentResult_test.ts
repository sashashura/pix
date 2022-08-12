// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, domainBuilder } = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Assessment... Remove this comment to see the full error message
const AssessmentResult = require('../../../../lib/domain/models/AssessmentResult');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Assessment... Remove this comment to see the full error message
const Assessment = require('../../../../lib/domain/models/Assessment');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Domain | Models | AssessmentResult', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#buildAlgoErrorResult', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return an algo error AssessmentResult', function () {
      // given
      const error = {
        message: 'message for jury',
      };

      // when
      const actualAssessmentResult = AssessmentResult.buildAlgoErrorResult({
        error,
        assessmentId: 123,
        juryId: 456,
        emitter: 'Moi',
      });

      // then
      const expectedAssessmentResult = domainBuilder.buildAssessmentResult({
        assessmentId: 123,
        juryId: 456,
        emitter: 'Moi',
        commentForJury: 'message for jury',
        status: AssessmentResult.status.ERROR,
        pixScore: 0,
        reproducibilityRate: 0,
        competenceMarks: [],
      });
      expectedAssessmentResult.id = undefined;
      expectedAssessmentResult.commentForCandidate = undefined;
      expectedAssessmentResult.commentForOrganization = undefined;
      expectedAssessmentResult.createdAt = undefined;
      expect(actualAssessmentResult).to.deepEqualInstance(expectedAssessmentResult);
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#buildStandardAssessmentResult', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return a standard AssessmentResult', function () {
      // when
      const actualAssessmentResult = AssessmentResult.buildStandardAssessmentResult({
        pixScore: 55,
        reproducibilityRate: 90,
        status: AssessmentResult.status.VALIDATED,
        assessmentId: 123,
        juryId: 456,
        emitter: 'Moi',
      });

      // then
      const expectedAssessmentResult = domainBuilder.buildAssessmentResult({
        assessmentId: 123,
        juryId: 456,
        emitter: 'Moi',
        commentForJury: 'Computed',
        status: AssessmentResult.status.VALIDATED,
        pixScore: 55,
        reproducibilityRate: 90,
        competenceMarks: [],
      });
      expectedAssessmentResult.id = undefined;
      expectedAssessmentResult.commentForCandidate = undefined;
      expectedAssessmentResult.commentForOrganization = undefined;
      expectedAssessmentResult.createdAt = undefined;
      expect(actualAssessmentResult).to.deepEqualInstance(expectedAssessmentResult);
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#buildNotTrustableAssessmentResult', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return a not trustable AssessmentResult', function () {
      // when
      const actualAssessmentResult = AssessmentResult.buildNotTrustableAssessmentResult({
        pixScore: 55,
        reproducibilityRate: 50.25,
        status: AssessmentResult.status.VALIDATED,
        assessmentId: 123,
        juryId: 456,
        emitter: 'Moi',
      });

      // then
      const expectedAssessmentResult = domainBuilder.buildAssessmentResult({
        assessmentId: 123,
        juryId: 456,
        emitter: 'Moi',
        commentForJury: 'Computed',
        status: AssessmentResult.status.VALIDATED,
        pixScore: 55,
        reproducibilityRate: 50.25,
        competenceMarks: [],
        commentForCandidate:
          'Un ou plusieurs problème(s) technique(s), signalé(s) à votre surveillant pendant la session de certification' +
          ', a/ont affecté la qualité du test de certification. En raison du trop grand nombre de questions auxquelles vous ' +
          "n'avez pas pu répondre dans de bonnes conditions, nous ne sommes malheureusement pas en mesure de calculer un " +
          'score fiable et de fournir un certificat. La certification est annulée, le prescripteur de votre certification' +
          '(le cas échéant), en est informé.',
        commentForOrganization:
          'Un ou plusieurs problème(s) technique(s), signalés par ce(cette) candidate au surveillant' +
          'de la session de certification, a/ont affecté le bon déroulement du test de certification. Nous sommes dans ' +
          "l'incapacité de le/la certifier, sa certification est donc annulée. Cette information est à prendre en compte " +
          'et peut vous conduire à proposer une nouvelle session de certification pour ce(cette) candidat(e).',
      });
      expectedAssessmentResult.id = undefined;
      expectedAssessmentResult.createdAt = undefined;
      expect(actualAssessmentResult).to.deepEqualInstance(expectedAssessmentResult);
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#buildStartedAssessmentResult', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return a started AssessmentResult', function () {
      // when
      const actualAssessmentResult = AssessmentResult.buildStartedAssessmentResult({ assessmentId: 123 });

      // then
      const expectedAssessmentResult = domainBuilder.buildAssessmentResult({
        assessmentId: 123,
        status: Assessment.states.STARTED,
        competenceMarks: [],
      });
      expectedAssessmentResult.id = undefined;
      expectedAssessmentResult.commentForCandidate = undefined;
      expectedAssessmentResult.commentForOrganization = undefined;
      expectedAssessmentResult.commentForJury = undefined;
      expectedAssessmentResult.createdAt = undefined;
      expectedAssessmentResult.emitter = undefined;
      expectedAssessmentResult.juryId = undefined;
      expectedAssessmentResult.pixScore = undefined;
      expectedAssessmentResult.reproducibilityRate = undefined;
      expect(actualAssessmentResult).to.deepEqualInstance(expectedAssessmentResult);
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#isValidated', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return true if the assessment result is validated', function () {
      // given
      const assessmentResult = domainBuilder.buildAssessmentResult.validated();

      // when
      const isValidated = assessmentResult.isValidated();

      // then
      expect(isValidated).to.be.true;
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return false if the assessment result is rejected', function () {
      // given
      const assessmentResult = domainBuilder.buildAssessmentResult.rejected();

      // when
      const isValidated = assessmentResult.isValidated();

      // then
      expect(isValidated).to.be.false;
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return false if the assessment result is in error', function () {
      // given
      const assessmentResult = domainBuilder.buildAssessmentResult.error();

      // when
      const isValidated = assessmentResult.isValidated();

      // then
      expect(isValidated).to.be.false;
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return false if the assessment result is started', function () {
      // given
      const assessmentResult = domainBuilder.buildAssessmentResult.started();

      // when
      const isValidated = assessmentResult.isValidated();

      // then
      expect(isValidated).to.be.false;
    });
  });
});
