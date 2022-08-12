// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'catchErr'.
const { catchErr, expect, sinon, domainBuilder } = require('../../../test-helper');

// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const getLastChallengeIdFromAssessmentId = require('../../../../lib/domain/usecases/get-last-challenge-id-from-assessment-id');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'assessment... Remove this comment to see the full error message
const assessmentRepository = require('../../../../lib/infrastructure/repositories/assessment-repository');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'NotFoundEr... Remove this comment to see the full error message
const { NotFoundError } = require('../../../../lib/domain/errors');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | UseCase | get-last-challenge-id-from-assessment-id', function () {
  let assessment: $TSFixMe;
  const assessmentLastChallengeId = 'last-challenge-id';

  // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
  beforeEach(async function () {
    assessment = await domainBuilder.buildAssessment({
      lastChallengeId: assessmentLastChallengeId,
    });

    sinon.stub(assessmentRepository, 'get');
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('should resolve the Assessment domain object matching the given assessment ID', async function () {
    assessmentRepository.get.resolves(assessment);

    const { lastChallengeId } = await getLastChallengeIdFromAssessmentId({
      assessmentId: assessment.id,
      assessmentRepository,
    });

    expect(lastChallengeId).to.equal(lastChallengeId);
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('should reject a domain NotFoundError when there is no assessment for given ID', async function () {
    assessmentRepository.get.resolves(null);

    // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
    const error = await catchErr(getLastChallengeIdFromAssessmentId)({
      assessmentRepository,
      assessmentId: assessment.id,
    });

    expect(error).to.be.an.instanceOf(NotFoundError, `Assessment not found for ID ${assessment.id}`);
  });
});
