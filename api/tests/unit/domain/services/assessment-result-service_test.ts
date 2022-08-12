// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, sinon } = require('../../../test-helper');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'service'.
const service = require('../../../../lib/domain/services/assessment-result-service');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'assessment... Remove this comment to see the full error message
const assessmentResultRepository = require('../../../../lib/infrastructure/repositories/assessment-result-repository');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'competence... Remove this comment to see the full error message
const competenceMarkRepository = require('../../../../lib/infrastructure/repositories/competence-mark-repository');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Assessment... Remove this comment to see the full error message
const AssessmentResult = require('../../../../lib/domain/models/AssessmentResult');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Competence... Remove this comment to see the full error message
const CompetenceMark = require('../../../../lib/domain/models/CompetenceMark');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Domain | Services | assessment-results', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#save', function () {
    const assessmentResult = new AssessmentResult({
      assessmentId: 1,
      level: 3,
      pixScore: 27,
      status: 'validated',
      emitter: 'Jury',
      commentForJury: 'Parce que',
      commentForCandidate: 'Voilà',
      commentForOrganization: 'Truc',
    });
    const competenceMarks = [
      new CompetenceMark({
        level: 2,
        score: 18,
        area_code: 2,
        competence_code: 2.1,
      }),
      new CompetenceMark({
        level: 3,
        score: 27,
        area_code: 3,
        competence_code: 3.2,
      }),
    ];

    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(function () {
      sinon.stub(assessmentResultRepository, 'save').resolves({ id: 1 });
      sinon.stub(competenceMarkRepository, 'save').resolves();
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should save the assessment results', async function () {
      // when
      await service.save(assessmentResult, competenceMarks);

      // then
      expect(assessmentResultRepository.save).to.have.been.calledOnce;
      expect(assessmentResultRepository.save).to.have.been.calledWithMatch(assessmentResult);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should save all competenceMarks', async function () {
      // when
      await service.save(assessmentResult, competenceMarks);

      // then
      expect(competenceMarkRepository.save).to.have.been.calledTwice;
      expect(competenceMarkRepository.save).to.have.been.calledWithMatch(
        new CompetenceMark({
          assessmentResultId: 1,
          level: 2,
          score: 18,
          area_code: 2,
          competence_code: 2.1,
        })
      );
      expect(competenceMarkRepository.save).to.have.been.calledWithMatch(
        new CompetenceMark({
          assessmentResultId: 1,
          level: 3,
          score: 27,
          area_code: 3,
          competence_code: 3.2,
        })
      );
    });
  });
});
