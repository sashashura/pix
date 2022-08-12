// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, sinon, domainBuilder } = require('../../../test-helper');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'getNextCha... Remove this comment to see the full error message
const getNextChallengeForCampaignAssessment = require('../../../../lib/domain/usecases/get-next-challenge-for-campaign-assessment');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'smartRando... Remove this comment to see the full error message
const smartRandom = require('../../../../lib/domain/services/algorithm-methods/smart-random');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'flash'.
const flash = require('../../../../lib/domain/services/algorithm-methods/flash');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'dataFetche... Remove this comment to see the full error message
const dataFetcher = require('../../../../lib/domain/services/algorithm-methods/data-fetcher');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Domain | Use Cases | get-next-challenge-for-campaign-assessment', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#get-next-challenge-for-campaign-assessment', function () {
    let challengeRepository: $TSFixMe;
    let answerRepository: $TSFixMe;
    let flashAssessmentResultRepository: $TSFixMe;
    let pickChallengeService: $TSFixMe;

    let assessment: $TSFixMe;
    let firstChallenge;
    let secondChallenge;

    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(function () {
      firstChallenge = domainBuilder.buildChallenge({ id: 'first_challenge' });
      secondChallenge = domainBuilder.buildChallenge({ id: 'second_challenge' });
      assessment = domainBuilder.buildAssessment({ id: 1165 });

      answerRepository = { findByAssessment: sinon.stub() };
      challengeRepository = { get: sinon.stub() };
      challengeRepository.get.withArgs('first_challenge').resolves(firstChallenge);
      challengeRepository.get.withArgs('second_challenge').resolves(secondChallenge);
      flashAssessmentResultRepository = Symbol('flashAssessmentResultRepository');
      pickChallengeService = { pickChallenge: sinon.stub() };
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should use smart-random algorithm', async function () {
      // given
      sinon
        .stub(smartRandom, 'getPossibleSkillsForNextChallenge')
        .resolves({ possibleSkillsForNextChallenge: [], hasAssessmentEnded: true });
      sinon.stub(dataFetcher, 'fetchForCampaigns').resolves({});

      // when
      await getNextChallengeForCampaignAssessment({
        challengeRepository,
        answerRepository,
        flashAssessmentResultRepository,
        pickChallengeService,
        assessment,
      });

      // then
      expect(smartRandom.getPossibleSkillsForNextChallenge).to.have.been.called;
    });

    // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
    describe('when assessment method is flash', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should use flash algorithm', async function () {
        // given
        assessment.method = 'FLASH';
        sinon.stub(flash, 'getPossibleNextChallenges').returns({ possibleChallenges: [], hasAssessmentEnded: false });
        sinon.stub(dataFetcher, 'fetchForFlashCampaigns').resolves({});
        const locale = 'fr-fr';
        // when
        await getNextChallengeForCampaignAssessment({
          challengeRepository,
          answerRepository,
          flashAssessmentResultRepository,
          pickChallengeService,
          assessment,
          locale,
        });

        // then
        expect(flash.getPossibleNextChallenges).to.have.been.called;
        expect(dataFetcher.fetchForFlashCampaigns).to.have.been.calledWith({
          assessment,
          answerRepository,
          challengeRepository,
          flashAssessmentResultRepository,
          locale,
        });
      });
    });
  });
});
