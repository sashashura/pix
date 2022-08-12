// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, sinon, domainBuilder } = require('../../../test-helper');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const getChallengeForPixAutoAnswer = require('../../../../lib/domain/usecases/get-challenge-for-pix-auto-answer');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'assessment... Remove this comment to see the full error message
const assessmentRepository = require('../../../../lib/infrastructure/repositories/assessment-repository');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'challengeF... Remove this comment to see the full error message
const challengeForPixAutoAnswerRepository = require('../../../../lib/infrastructure/repositories/challenge-for-pix-auto-answer-repository');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | UseCase | get-challenge-answer-for-pix-button', function () {
  let assessment: $TSFixMe;
  const challengeId = 1;
  const challenge = {
    id: challengeId,
    solution: 'answer \n answer',
    type: 'QROC',
    isAutoReply: false,
  };
  const lastChallengeId = 'last challenge id';

  // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
  beforeEach(function () {
    assessment = domainBuilder.buildAssessment({
      lastChallengeId,
    });

    sinon.stub(assessmentRepository, 'get');
    sinon.stub(challengeForPixAutoAnswerRepository, 'get');
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('should return the solution of the last challenge from the given assessment', async function () {
    assessmentRepository.get.resolves(assessment);
    challengeForPixAutoAnswerRepository.get.resolves(challenge);

    const result = await getChallengeForPixAutoAnswer({
      challengeId,
      assessmentRepository,
      challengeForPixAutoAnswerRepository,
    });

    expect(result).to.deep.equal(challenge);
  });
});
