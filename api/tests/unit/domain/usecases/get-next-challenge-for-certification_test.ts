// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, sinon } = require('../../../test-helper');

// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const getNextChallengeForCertification = require('../../../../lib/domain/usecases/get-next-challenge-for-certification');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Assessment... Remove this comment to see the full error message
const Assessment = require('../../../../lib/domain/models/Assessment');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Domain | Use Cases | get-next-challenge-for-certification', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#getNextChallengeForCertification', function () {
    let certificationChallengeRepository: $TSFixMe;
    let challengeRepository: $TSFixMe;

    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(function () {
      certificationChallengeRepository = { getNextNonAnsweredChallengeByCourseId: sinon.stub().resolves() };
      challengeRepository = { get: sinon.stub().resolves() };
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should use the assessmentService to select the next CertificationChallenge', async function () {
      // given
      const nextChallenge = Symbol('nextChallenge');
      const assessment = new Assessment({ id: 156, certificationCourseId: 54516 });

      certificationChallengeRepository.getNextNonAnsweredChallengeByCourseId.resolves(nextChallenge);

      // when
      await getNextChallengeForCertification({ assessment, certificationChallengeRepository, challengeRepository });

      // then
      expect(certificationChallengeRepository.getNextNonAnsweredChallengeByCourseId).to.have.been.calledWith(
        156,
        54516
      );
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return the next Challenge', async function () {
      // given
      const challengeId = 15167432;
      const nextChallengeToAnswer = Symbol('nextChallengeToAnswer');
      const nextCertificationChallenge = { challengeId };
      const assessment = new Assessment({ id: 156, courseId: 54516 });

      certificationChallengeRepository.getNextNonAnsweredChallengeByCourseId.resolves(nextCertificationChallenge);
      challengeRepository.get.resolves(nextChallengeToAnswer);

      // when
      const challenge = await getNextChallengeForCertification({
        assessment,
        certificationChallengeRepository,
        challengeRepository,
      });

      // then
      expect(challenge).to.equal(nextChallengeToAnswer);
      expect(challengeRepository.get).to.have.been.calledWith(challengeId);
    });
  });
});
