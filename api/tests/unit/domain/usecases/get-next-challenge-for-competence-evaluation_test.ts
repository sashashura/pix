// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, sinon, catchErr, domainBuilder } = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'UserNotAut... Remove this comment to see the full error message
const { UserNotAuthorizedToAccessEntityError } = require('../../../../lib/domain/errors');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const getNextChallengeForCompetenceEvaluation = require('../../../../lib/domain/usecases/get-next-challenge-for-competence-evaluation');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'smartRando... Remove this comment to see the full error message
const smartRandom = require('../../../../lib/domain/services/algorithm-methods/smart-random');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Domain | Use Cases | get-next-challenge-for-competence-evaluation', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#getNextChallengeForCompetenceEvaluation', function () {
    let userId: $TSFixMe,
      assessmentId: $TSFixMe,
      competenceId: $TSFixMe,
      assessment: $TSFixMe,
      lastAnswer: $TSFixMe,
      challenges: $TSFixMe,
      targetSkills: $TSFixMe,
      locale: $TSFixMe,
      answerRepository: $TSFixMe,
      challengeRepository: $TSFixMe,
      skillRepository: $TSFixMe,
      knowledgeElementRepository: $TSFixMe,
      pickChallengeService: $TSFixMe,
      recentKnowledgeElements: $TSFixMe,
      actualComputedChallenge: $TSFixMe,
      challengeUrl21,
      challengeUrl22: $TSFixMe,
      improvementService: $TSFixMe;

    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(async function () {
      userId = 'dummyUserId';
      competenceId = 'dummyCompetenceId';
      assessmentId = 24;

      assessment = { id: assessmentId, userId, competenceId };
      challenges = [];
      targetSkills = [];
      lastAnswer = null;
      locale = 'fr';

      answerRepository = { findByAssessment: sinon.stub().resolves([lastAnswer]) };
      challengeRepository = { findValidatedByCompetenceId: sinon.stub().resolves(challenges) };
      skillRepository = { findActiveByCompetenceId: sinon.stub().resolves(targetSkills) };
      pickChallengeService = { pickChallenge: sinon.stub().resolves(challengeUrl22) };

      recentKnowledgeElements = [
        { createdAt: 4, skillId: 'url2' },
        { createdAt: 2, skillId: 'web1' },
      ];
      knowledgeElementRepository = { findUniqByUserId: sinon.stub().resolves(recentKnowledgeElements) };
      improvementService = { filterKnowledgeElementsIfImproving: sinon.stub().resolves(recentKnowledgeElements) };

      const web2 = domainBuilder.buildSkill({ name: '@web2' });
      web2.challenges = [
        domainBuilder.buildChallenge({ id: 'challenge_web2_1' }),
        domainBuilder.buildChallenge({ id: 'challenge_web2_2' }),
      ];
      const url2 = domainBuilder.buildSkill({ name: '@url2' });
      challengeUrl21 = domainBuilder.buildChallenge({ id: 'challenge_url2_1' });
      challengeUrl22 = domainBuilder.buildChallenge({ id: 'challenge_url2_2' });
      url2.challenges = [challengeUrl21, challengeUrl22];
      const search2 = domainBuilder.buildSkill({ name: '@search2' });
      search2.challenges = [
        domainBuilder.buildChallenge({ id: 'challenge_search2_1' }),
        domainBuilder.buildChallenge({ id: 'challenge_search2_2' }),
      ];

      sinon.stub(smartRandom, 'getPossibleSkillsForNextChallenge').returns({
        hasAssessmentEnded: false,
        possibleSkillsForNextChallenge: [web2, url2, search2],
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when user is not related to assessment', function () {
      let requestErr: $TSFixMe;
      // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
      beforeEach(async function () {
        // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
        requestErr = await catchErr(getNextChallengeForCompetenceEvaluation)({
          assessment,
          userId: userId + 1,
          answerRepository,
          challengeRepository,
          knowledgeElementRepository,
          skillRepository,
          pickChallengeService,
          improvementService,
          locale,
        });
      });
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should throw a UserNotAuthorizedToAccessEntityError error', function () {
        expect(requestErr).to.be.instanceOf(UserNotAuthorizedToAccessEntityError);
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when user is related to assessment', function () {
      // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
      beforeEach(async function () {
        actualComputedChallenge = await getNextChallengeForCompetenceEvaluation({
          assessment,
          userId,
          answerRepository,
          challengeRepository,
          knowledgeElementRepository,
          skillRepository,
          pickChallengeService,
          improvementService,
          locale,
        });
      });
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should have fetched the answers', function () {
        expect(answerRepository.findByAssessment).to.have.been.calledWithExactly(assessmentId);
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should have fetched the most recent knowledge elements', function () {
        expect(knowledgeElementRepository.findUniqByUserId).to.have.been.calledWithExactly({ userId });
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should have fetched the challenges', function () {
        expect(challengeRepository.findValidatedByCompetenceId).to.have.been.calledWithExactly(competenceId);
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should have fetched the next challenge with only most recent knowledge elements', function () {
        const allAnswers = [lastAnswer];
        expect(smartRandom.getPossibleSkillsForNextChallenge).to.have.been.calledWithExactly({
          allAnswers,
          lastAnswer,
          challenges,
          targetSkills,
          knowledgeElements: recentKnowledgeElements,
          locale,
        });
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should have returned the next challenge', function () {
        expect(actualComputedChallenge.id).to.equal(challengeUrl22.id);
      });
    });
  });
});
