// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Answer'.
const Answer = require('../../../../lib/domain/models/Answer');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Skill'.
const Skill = require('../../../../lib/domain/models/Skill');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, domainBuilder } = require('../../../test-helper');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Domain | Models | Answer', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('constructor', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should build an Answer from raw JSON', function () {
      // given
      const rawData = {
        id: 2,
        value: 'Avast, Norton',
        result: 'ok',
        resultDetails: 'champs1 : ok \n champs2 : ko',
        timeout: 0,
        challengeId: 'redRecordId',
        assessmentId: 82,
        levelup: {},
        timeSpent: 30,
        isFocusedOut: false,
      };

      const expectedAnswer = {
        id: 2,
        value: 'Avast, Norton',
        result: { status: 'ok' },
        resultDetails: 'champs1 : ok \n champs2 : ko',
        timeout: 0,
        challengeId: 'redRecordId',
        assessmentId: 82,
        levelup: {},
        timeSpent: 30,
        isFocusedOut: false,
      };

      // when
      const answer = new Answer(rawData);

      // then
      expect(answer).to.deep.equal(expectedAnswer);
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('isOK', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return true if answer is ok', function () {
      // given
      const answer = new Answer({ result: 'ok' });

      // when/then
      expect(answer.isOk()).to.be.true;
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return false if answer is different than ok', function () {
      // given
      const answer = new Answer({ result: 'notok' });

      // when/then
      expect(answer.isOk()).to.be.false;
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('isPartially', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return true if answer is partially', function () {
      // given
      const answer = new Answer({ result: 'partially' });

      // when
      expect(answer.isPartially()).to.be.true;
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return false if answer is different than partially', function () {
      // given
      const answer = new Answer({ result: 'notok' });

      // when
      expect(answer.isPartially()).to.be.false;
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#maxDifficulty', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should exist', function () {
      // given
      const answer = new Answer({ result: 'ko' });
      answer.challenge = { skills: [] };

      // then
      expect(answer.maxDifficulty).to.exist;
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return the maximal skill difficulty of a challenge', function () {
      // given
      const web5 = new Skill({ name: '@web5' });
      const url1 = new Skill({ name: '@url1' });
      const challenge = { skills: [web5, url1] };
      const answer = new Answer({ result: 'ko' });
      answer.challenge = challenge;

      // when
      const maxDifficulty = answer.maxDifficulty();

      // then
      expect(maxDifficulty).to.equal(5);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return the base difficulty if the challenge is undefined', function () {
      // given
      const answer = new Answer({});

      const baseDifficulty = 2;
      // when
      const maxDifficulty = answer.maxDifficulty(baseDifficulty);

      // then
      expect(maxDifficulty).to.equal(baseDifficulty);
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#binaryOutcome', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should exist', function () {
      // given
      const answer = new Answer({ result: 'ko' });

      // then
      expect(answer.binaryOutcome).to.exist;
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return 1 if answer is correct', function () {
      // given
      const answer = new Answer({ result: 'ok' });

      // when
      const maxDifficulty = answer.binaryOutcome;

      // then
      expect(maxDifficulty).to.equal(1);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return 0 if answer is not correct', function () {
      // given
      const answer = new Answer({ result: 'ko' });

      // when
      const maxDifficulty = answer.binaryOutcome;

      // then
      expect(maxDifficulty).to.equal(0);
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#hasTimedOut', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return true if answer has timed out', function () {
      // given
      const answer = domainBuilder.buildAnswer({ timeout: -1 });

      // when
      const hasTimedOut = answer.hasTimedOut;

      // then
      expect(hasTimedOut).to.be.true;
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return false if answer has not timed out', function () {
      // given
      const answer = domainBuilder.buildAnswer({ timeout: 1 });

      // when
      const hasTimedOut = answer.hasTimedOut;

      // then
      expect(hasTimedOut).to.be.false;
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#setTimeSpentFrom', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return the computed time spent on a challenge', function () {
      // given
      const answer = domainBuilder.buildAnswer();
      const lastQuestionDate = new Date('2021-03-11T11:00:00Z');
      const now = new Date('2021-03-11T11:00:04Z');
      now.setMilliseconds(1);

      // when
      answer.setTimeSpentFrom({ now, lastQuestionDate });

      // then
      expect(answer.timeSpent).to.equal(5);
    });
  });
});
