// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, mockLearningContent } = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'challengeF... Remove this comment to see the full error message
const challengeForPixAutoAnswerRepository = require('../../../../lib/infrastructure/repositories/challenge-for-pix-auto-answer-repository');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Integration | Repository | challenge-for-pix-auto-answer-repository', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#get', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return the requested challenge for pix-auto-answer', async function () {
      // given
      const challengeId = 'challenge_id';
      const challengeSolution = 'solution';
      const learningContent = {
        challenges: [{ id: challengeId, solution: challengeSolution, type: 'QROC', autoReply: false }],
      };

      mockLearningContent(learningContent);

      // when
      const challenge = await challengeForPixAutoAnswerRepository.get(challengeId);

      // then
      expect(challenge.id).to.equal(challengeId);
      expect(challenge.solution).to.equal(challengeSolution);
      expect(challenge.type).to.equal('QROC');
      expect(challenge.autoReply).to.equal(false);
    });
  });
});
