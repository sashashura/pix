// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'moment'.
const moment = require('moment');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, sinon } = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'KnowledgeE... Remove this comment to see the full error message
const KnowledgeElement = require('../../../../lib/domain/models/KnowledgeElement');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Scorecard'... Remove this comment to see the full error message
const Scorecard = require('../../../../lib/domain/models/Scorecard');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'constants'... Remove this comment to see the full error message
const constants = require('../../../../lib/domain/constants');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Domain | Models | Scorecard', function () {
  let computeDaysSinceLastKnowledgeElementStub: $TSFixMe;

  // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
  beforeEach(function () {
    computeDaysSinceLastKnowledgeElementStub = sinon.stub(KnowledgeElement, 'computeDaysSinceLastKnowledgeElement');
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#buildFrom', function () {
    let competenceEvaluation: $TSFixMe;
    let actualScorecard: $TSFixMe;

    const userId = '123';
    const competence = {
      id: 1,
      name: 'Évaluer',
      description: 'Les compétences numériques',
      area: 'area',
      index: 'index',
    };

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('with existing competence evaluation and assessment', function () {
      // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
      beforeEach(function () {
        // given
        competenceEvaluation = {
          status: 'started',
          assessment: { state: 'started' },
        };
        const knowledgeElements = [
          { earnedPix: 5.5, createdAt: new Date() },
          {
            earnedPix: 3.6,
            createdAt: new Date(),
          },
        ];
        computeDaysSinceLastKnowledgeElementStub.withArgs(knowledgeElements).returns(0);
        // when
        actualScorecard = Scorecard.buildFrom({ userId, knowledgeElements, competenceEvaluation, competence });
      });
      // then
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should build an object of Scorecard type', function () {
        expect(actualScorecard).to.be.instanceOf(Scorecard);
      });
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should build a scorecard id from a combination of userId and competenceId', function () {
        expect(actualScorecard.id).to.equal(userId + '_' + competence.id);
      });
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should competence datas to the scorecard object', function () {
        expect(actualScorecard.name).to.equal(competence.name);
        expect(actualScorecard.competenceId).to.equal(competence.id);
        expect(actualScorecard.area).to.equal(competence.area);
        expect(actualScorecard.index).to.equal(competence.index);
        expect(actualScorecard.description).to.equal(competence.description);
      });
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should have earned pix as a rounded sum of all knowledge elements earned pixes', function () {
        expect(actualScorecard.earnedPix).to.equal(9);
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should have exactly earned pix as a sum of all knowledge elements earned pixes', function () {
        expect(actualScorecard.exactlyEarnedPix).to.equal(9.1);
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should have a level computed from the number of pixes', function () {
        expect(actualScorecard.earnedPix).to.equal(9);
      });
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should have set the number of pix ahead of the next level', function () {
        expect(actualScorecard.pixScoreAheadOfNextLevel).to.equal(1);
      });
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should have set the scorecard status based on the competence evaluation status', function () {
        expect(actualScorecard.status).to.equal((Scorecard.statuses as $TSFixMe).STARTED);
      });
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should have set the scorecard remainingDaysBeforeReset based on last knowledge element date', function () {
        expect(actualScorecard.remainingDaysBeforeReset).to.equal(7);
      });
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should have set the scorecard remainingDaysBeforeImproving based on last knowledge element date', function () {
        expect(actualScorecard.remainingDaysBeforeImproving).to.equal(4);
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when the competence evaluation has never been started', function () {
      // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
      beforeEach(function () {
        // given
        competenceEvaluation = undefined;
        const knowledgeElements: $TSFixMe = [];
        computeDaysSinceLastKnowledgeElementStub.withArgs(knowledgeElements).returns(0);
        //when
        actualScorecard = Scorecard.buildFrom({ userId, knowledgeElements, competenceEvaluation, competence });
      });
      // then
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should have set the scorecard status NOT_STARTED', function () {
        expect(actualScorecard.status).to.equal((Scorecard.statuses as $TSFixMe).NOT_STARTED);
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when the competence evaluation has never been started and some knowledgeElements exist', function () {
      // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
      beforeEach(function () {
        // given
        competenceEvaluation = undefined;
        const knowledgeElements = [
          { earnedPix: 5.5, createdAt: new Date() },
          {
            earnedPix: 3.6,
            createdAt: new Date(),
          },
        ];
        computeDaysSinceLastKnowledgeElementStub.withArgs(knowledgeElements).returns(0);
        //when
        actualScorecard = Scorecard.buildFrom({ userId, knowledgeElements, competenceEvaluation, competence });
      });
      // then
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should have set the scorecard status STARTED', function () {
        expect(actualScorecard.status).to.equal((Scorecard.statuses as $TSFixMe).STARTED);
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when the competence evaluation has been reset but no knowledgeElements exist', function () {
      // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
      beforeEach(function () {
        // given
        const knowledgeElements: $TSFixMe = [];
        computeDaysSinceLastKnowledgeElementStub.withArgs(knowledgeElements).returns(0);
        competenceEvaluation = { status: 'reset' };
        //when
        actualScorecard = Scorecard.buildFrom({ userId, knowledgeElements, competenceEvaluation, competence });
      });
      // then
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should have set the scorecard status based on the competence evaluation status', function () {
        expect(actualScorecard.status).to.equal('NOT_STARTED');
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when the competence evaluation has been reset and some knowledgeElements exist', function () {
      // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
      beforeEach(function () {
        // given
        const knowledgeElements = [
          { earnedPix: 5.5, createdAt: new Date() },
          {
            earnedPix: 3.6,
            createdAt: new Date(),
          },
        ];
        computeDaysSinceLastKnowledgeElementStub.withArgs(knowledgeElements).returns(0);
        competenceEvaluation = { status: 'reset' };

        //when
        actualScorecard = Scorecard.buildFrom({ userId, knowledgeElements, competenceEvaluation, competence });
      });
      // then
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should have set the scorecard status STARTED', function () {
        expect(actualScorecard.status).to.equal((Scorecard.statuses as $TSFixMe).STARTED);
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when the user has no knowledge elements for the competence', function () {
      // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
      beforeEach(function () {
        // given
        const knowledgeElements: $TSFixMe = [];
        computeDaysSinceLastKnowledgeElementStub.withArgs(knowledgeElements).returns(0);
        competenceEvaluation = { status: 'reset' };
        //when
        actualScorecard = Scorecard.buildFrom({ userId, knowledgeElements: [], competenceEvaluation, competence });
      });
      // then
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should have a dayBeforeReset at null', function () {
        expect(actualScorecard.remainingDaysBeforeReset).to.be.null;
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should have a dayBeforeImproving at null', function () {
        expect(actualScorecard.remainingDaysBeforeImproving).to.be.null;
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when the user level is beyond the upper limit allowed', function () {
      let knowledgeElements: $TSFixMe;
      // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
      beforeEach(function () {
        // given
        knowledgeElements = [{ earnedPix: 50 }, { earnedPix: 70 }];
        computeDaysSinceLastKnowledgeElementStub.withArgs(knowledgeElements).returns(0);
      });
      // then
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should have the competence level capped at the maximum value', function () {
        //when
        actualScorecard = Scorecard.buildFrom({ userId, knowledgeElements, competenceEvaluation, competence });

        expect(actualScorecard.level).to.equal(5);
        expect(actualScorecard.earnedPix).to.equal(40);
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should have the competence level not capped at the maximum value if we allow it', function () {
        //when
        actualScorecard = Scorecard.buildFrom({
          userId,
          knowledgeElements,
          competenceEvaluation,
          competence,
          allowExcessLevel: true,
        });

        expect(actualScorecard.level).to.equal(15);
        expect(actualScorecard.earnedPix).to.equal(40);
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when the user pix score is higher than the max', function () {
      let knowledgeElements: $TSFixMe;
      // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
      beforeEach(function () {
        // given
        knowledgeElements = [{ earnedPix: 50 }, { earnedPix: 70 }];
        computeDaysSinceLastKnowledgeElementStub.withArgs(knowledgeElements).returns(0);
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should have the number of pix blocked', function () {
        //when
        actualScorecard = Scorecard.buildFrom({
          userId,
          knowledgeElements,
          competenceEvaluation,
          competence,
        });
        // then
        expect(actualScorecard.earnedPix).to.equal(constants.MAX_REACHABLE_PIX_BY_COMPETENCE);
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should have the same number of pix if we allow it', function () {
        //when
        actualScorecard = Scorecard.buildFrom({
          userId,
          knowledgeElements,
          competenceEvaluation,
          competence,
          allowExcessPix: true,
        });
        // then
        expect(actualScorecard.earnedPix).to.equal(120);
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when there is no knowledge elements', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return null when looking for remainingDaysBeforeReset', function () {
        const knowledgeElements: $TSFixMe = [];

        // when
        actualScorecard = Scorecard.buildFrom({ userId, knowledgeElements, competenceEvaluation, competence });

        // then
        expect(actualScorecard.remainingDaysBeforeReset).to.equal(null);
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return null when looking for remainingDaysBeforeImproving', function () {
        const knowledgeElements: $TSFixMe = [];

        // when
        actualScorecard = Scorecard.buildFrom({ userId, knowledgeElements, competenceEvaluation, competence });

        // then
        expect(actualScorecard.remainingDaysBeforeImproving).to.equal(null);
      });
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#computeRemainingDaysBeforeReset', function () {
    let testCurrentDate: $TSFixMe;
    // TODO: Fix this the next time the file is edited.
    // eslint-disable-next-line mocha/no-setup-in-describe
    const originalConstantValue = constants.MINIMUM_DELAY_IN_DAYS_FOR_RESET;

    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(function () {
      testCurrentDate = new Date('2018-01-10T05:00:00Z');
      sinon.useFakeTimers(testCurrentDate.getTime());
    });

    // @ts-expect-error TS(2304): Cannot find name 'before'.
    before(function () {
      constants.MINIMUM_DELAY_IN_DAYS_FOR_RESET = 7;
    });

    // @ts-expect-error TS(2304): Cannot find name 'after'.
    after(function () {
      constants.MINIMUM_DELAY_IN_DAYS_FOR_RESET = originalConstantValue;
    });

    // eslint-disable-next-line mocha/no-setup-in-describe
    [
      { daysSinceLastKnowledgeElement: 0.0833, expectedDaysBeforeReset: 7 },
      { daysSinceLastKnowledgeElement: 1, expectedDaysBeforeReset: 6 },
      { daysSinceLastKnowledgeElement: 5, expectedDaysBeforeReset: 2 },
      { daysSinceLastKnowledgeElement: 5.5, expectedDaysBeforeReset: 2 },
      { daysSinceLastKnowledgeElement: 6, expectedDaysBeforeReset: 1 },
      { daysSinceLastKnowledgeElement: 6.4583, expectedDaysBeforeReset: 1 },
      { daysSinceLastKnowledgeElement: 6.5, expectedDaysBeforeReset: 1 },
      { daysSinceLastKnowledgeElement: 6.5416, expectedDaysBeforeReset: 1 },
      { daysSinceLastKnowledgeElement: 7, expectedDaysBeforeReset: 0 },
      { daysSinceLastKnowledgeElement: 10, expectedDaysBeforeReset: 0 },
    ].forEach(({ daysSinceLastKnowledgeElement, expectedDaysBeforeReset }) => {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it(`should return ${expectedDaysBeforeReset} days when ${daysSinceLastKnowledgeElement} days passed since last knowledge element`, function () {
        const date = moment(testCurrentDate).toDate();
        const knowledgeElements = [{ createdAt: date }];

        computeDaysSinceLastKnowledgeElementStub.returns(daysSinceLastKnowledgeElement);

        // when
        const remainingDaysBeforeReset = Scorecard.computeRemainingDaysBeforeReset(knowledgeElements);

        // then
        expect(remainingDaysBeforeReset).to.equal(expectedDaysBeforeReset);
      });
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#computeRemainingDaysBeforeImproving', function () {
    let testCurrentDate: $TSFixMe;
    // TODO: Fix this the next time the file is edited.
    // eslint-disable-next-line mocha/no-setup-in-describe
    const originalConstantValue = constants.MINIMUM_DELAY_IN_DAYS_BEFORE_IMPROVING;

    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(function () {
      testCurrentDate = new Date('2018-01-10T05:00:00Z');
      sinon.useFakeTimers(testCurrentDate.getTime());
    });

    // @ts-expect-error TS(2304): Cannot find name 'before'.
    before(function () {
      constants.MINIMUM_DELAY_IN_DAYS_BEFORE_IMPROVING = 4;
    });

    // @ts-expect-error TS(2304): Cannot find name 'after'.
    after(function () {
      constants.MINIMUM_DELAY_IN_DAYS_BEFORE_IMPROVING = originalConstantValue;
    });

    // eslint-disable-next-line mocha/no-setup-in-describe
    [
      { daysSinceLastKnowledgeElement: 0.0833, expectedDaysBeforeImproving: 4 },
      { daysSinceLastKnowledgeElement: 0, expectedDaysBeforeImproving: 4 },
      { daysSinceLastKnowledgeElement: 1, expectedDaysBeforeImproving: 3 },
      { daysSinceLastKnowledgeElement: 1.5, expectedDaysBeforeImproving: 3 },
      { daysSinceLastKnowledgeElement: 2.4583, expectedDaysBeforeImproving: 2 },
      { daysSinceLastKnowledgeElement: 4, expectedDaysBeforeImproving: 0 },
      { daysSinceLastKnowledgeElement: 7, expectedDaysBeforeImproving: 0 },
      { daysSinceLastKnowledgeElement: 10, expectedDaysBeforeImproving: 0 },
    ].forEach(({ daysSinceLastKnowledgeElement, expectedDaysBeforeImproving }) => {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it(`should return ${expectedDaysBeforeImproving} days when ${daysSinceLastKnowledgeElement} days passed since last knowledge element`, function () {
        const date = moment(testCurrentDate).toDate();
        const knowledgeElements = [{ createdAt: date }];

        computeDaysSinceLastKnowledgeElementStub.returns(daysSinceLastKnowledgeElement);

        // when
        const remainingDaysBeforeImproving = Scorecard.computeRemainingDaysBeforeImproving(knowledgeElements);

        // then
        expect(remainingDaysBeforeImproving).to.equal(expectedDaysBeforeImproving);
      });
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#parseId', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return a JSON object with parsed user ID and competence ID', function () {
      // given
      const id = '1234_recABC1234';

      // when
      const result = Scorecard.parseId(id);

      // then
      expect(result).to.deep.equal({
        userId: 1234,
        competenceId: 'recABC1234',
      });
    });
  });
});
