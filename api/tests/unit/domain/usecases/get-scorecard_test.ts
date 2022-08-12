// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'sinon'.
const { sinon, expect } = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'UserNotAut... Remove this comment to see the full error message
const { UserNotAuthorizedToAccessEntityError } = require('../../../../lib/domain/errors');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Scorecard'... Remove this comment to see the full error message
const Scorecard = require('../../../../lib/domain/models/Scorecard');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const getScorecard = require('../../../../lib/domain/usecases/get-scorecard');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | UseCase | get-scorecard', function () {
  let scorecardService: $TSFixMe;
  let competenceRepository: $TSFixMe;
  let competenceEvaluationRepository: $TSFixMe;
  let knowledgeElementRepository: $TSFixMe;
  let scorecardId: $TSFixMe;
  let competenceId: $TSFixMe;
  let authenticatedUserId: $TSFixMe;
  let parseIdStub: $TSFixMe;
  const locale = 'fr';

  // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
  beforeEach(function () {
    scorecardId = '1_1';
    competenceId = 1;
    authenticatedUserId = 1;
    scorecardService = { computeScorecard: sinon.stub() };
    parseIdStub = sinon.stub(Scorecard, 'parseId');
    competenceRepository = {};
    competenceEvaluationRepository = {};
    knowledgeElementRepository = {};
  });

  // @ts-expect-error TS(2304): Cannot find name 'afterEach'.
  afterEach(function () {
    sinon.restore();
  });

  // @ts-expect-error TS(2304): Cannot find name 'context'.
  context('When user is authenticated', function () {
    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(function () {
      parseIdStub.withArgs(scorecardId).returns({ competenceId, userId: authenticatedUserId });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('And user asks for his own scorecard', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should resolve', function () {
        // given
        scorecardService.computeScorecard
          .withArgs({
            userId: authenticatedUserId,
            competenceRepository,
            competenceEvaluationRepository,
            knowledgeElementRepository,
            locale,
          })
          .resolves({});

        // when
        const promise = getScorecard({
          authenticatedUserId,
          scorecardId,
          scorecardService,
          competenceRepository,
          competenceEvaluationRepository,
          knowledgeElementRepository,
          locale,
        });

        // then
        return expect(promise).to.be.fulfilled;
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return the user scorecard', async function () {
        // given
        const scorecard = Symbol('Scorecard');

        scorecardService.computeScorecard.resolves(scorecard);

        // when
        const userScorecard = await getScorecard({
          authenticatedUserId,
          scorecardId,
          scorecardService,
        });

        //then
        expect(userScorecard).to.deep.equal(scorecard);
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('And user asks for a scorecard that do not belongs to him', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should reject a "UserNotAuthorizedToAccessEntityError" domain error', function () {
        // given
        const unauthorizedUserId = 42;
        scorecardService.computeScorecard.resolves({});

        // when
        const promise = getScorecard({
          authenticatedUserId: unauthorizedUserId,
          scorecardId,
          scorecardService,
        });

        // then
        return expect(promise).to.be.rejectedWith(UserNotAuthorizedToAccessEntityError);
      });
    });
  });
});
