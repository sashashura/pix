// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'sinon'.
const { sinon, expect, hFake } = require('../../../test-helper');

// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const assessmentResultController = require('../../../../lib/application/assessment-results/assessment-result-controller');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'assessment... Remove this comment to see the full error message
const assessmentResultService = require('../../../../lib/domain/services/assessment-result-service');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Assessment... Remove this comment to see the full error message
const AssessmentResult = require('../../../../lib/domain/models/AssessmentResult');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Competence... Remove this comment to see the full error message
const CompetenceMark = require('../../../../lib/domain/models/CompetenceMark');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Controller | assessment-results', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#save', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return a Assessment Result and an Array of Competence Marks', async function () {
      // given
      const competenceMark1 = new CompetenceMark({
        level: 2,
        score: 18,
        area_code: 2,
        competence_code: 2.1,
        competenceId: 'rec123456',
      });
      const competenceMark2 = new CompetenceMark({
        level: 3,
        score: 27,
        area_code: 3,
        competence_code: 3.2,
        competenceId: 'rec159753',
      });
      const competenceMark3 = new CompetenceMark({
        level: 1,
        score: 9,
        area_code: 1,
        competence_code: 1.3,
        competenceId: 'rec456789',
      });
      sinon.stub(assessmentResultService, 'save').resolves();
      const request = {
        payload: {
          data: {
            attributes: {
              'assessment-id': 2,
              'certification-id': 1,
              level: 3,
              'pix-score': 27,
              status: 'validated',
              emitter: 'Jury',
              'comment-for-jury': 'Envie de faire un nettoyage de printemps dans les notes',
              'comment-for-candidate': 'Tada',
              'comment-for-organization': 'Je suis sûr que vous etes ok avec nous',
              'competences-with-mark': [
                {
                  level: 2,
                  score: 18,
                  area_code: 2,
                  competence_code: 2.1,
                  competenceId: 'rec123456',
                },
                {
                  level: 3,
                  score: 27,
                  area_code: 3,
                  competence_code: 3.2,
                  competenceId: 'rec159753',
                },
                {
                  level: 1,
                  score: 9,
                  area_code: 1,
                  competence_code: 1.3,
                  competenceId: 'rec456789',
                },
              ],
            },
            type: 'assessment-results',
          },
        },
        auth: {
          credentials: {
            userId: 1,
          },
        },
      };

      // when
      const response = await assessmentResultController.save(request, hFake);

      // then
      const expectedAssessmentResult = new AssessmentResult({
        assessmentId: 2,
        level: 3,
        pixScore: 27,
        status: 'validated',
        emitter: 'Jury',
        commentForJury: 'Envie de faire un nettoyage de printemps dans les notes',
        commentForCandidate: 'Tada',
        commentForOrganization: 'Je suis sûr que vous etes ok avec nous',
        juryId: 1,
      });
      expect(response).to.be.null;
      expect(assessmentResultService.save).to.have.been.calledWithMatch(expectedAssessmentResult, [
        competenceMark1,
        competenceMark2,
        competenceMark3,
      ]);
    });
  });
});
