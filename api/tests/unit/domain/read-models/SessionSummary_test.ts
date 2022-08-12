// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect } = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'SessionSum... Remove this comment to see the full error message
const SessionSummary = require('../../../../lib/domain/read-models/SessionSummary');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Domain | Read-Models | SessionSummary', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#static from', function () {
    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when both finalizedAt and publishedAt are null', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should build a CREATED session summary', function () {
        // given
        const args = {
          id: 1,
          address: 'ici',
          room: 'la-bas',
          date: '2020-01-01',
          time: '16:00',
          examiner: 'Moi',
          enrolledCandidatesCount: 5,
          effectiveCandidatesCount: 4,
          finalizedAt: null,
          publishedAt: null,
        };

        // when
        const sessionSummary = SessionSummary.from(args);

        // then
        expect(sessionSummary.status).to.equal(SessionSummary.statuses.CREATED);
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when finalizedAt is not null', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should build a FINALIZED session summary', function () {
        // given
        const args = {
          id: 1,
          address: 'ici',
          room: 'la-bas',
          date: '2020-01-01',
          time: '16:00',
          examiner: 'Moi',
          enrolledCandidatesCount: 5,
          effectiveCandidatesCount: 4,
          finalizedAt: new Date('2020-01-04'),
          publishedAt: null,
        };

        // when
        const sessionSummary = SessionSummary.from(args);

        // then
        expect(sessionSummary.status).to.equal(SessionSummary.statuses.FINALIZED);
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when publishedAt is not null', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should build a PROCESSED session summary', function () {
        // given
        const args = {
          id: 1,
          address: 'ici',
          room: 'la-bas',
          date: '2020-01-01',
          time: '16:00',
          examiner: 'Moi',
          enrolledCandidatesCount: 5,
          effectiveCandidatesCount: 4,
          finalizedAt: null,
          publishedAt: new Date('2020-02-04'),
        };

        // when
        const sessionSummary = SessionSummary.from(args);

        // then
        expect(sessionSummary.status).to.equal(SessionSummary.statuses.PROCESSED);
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when both finalizedAt and publishedAt are not null', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should build a PROCESSED session summary', function () {
        // given
        const args = {
          id: 1,
          address: 'ici',
          room: 'la-bas',
          date: '2020-01-01',
          time: '16:00',
          examiner: 'Moi',
          enrolledCandidatesCount: 5,
          effectiveCandidatesCount: 4,
          finalizedAt: new Date('2020-01-04'),
          publishedAt: new Date('2020-02-04'),
        };

        // when
        const sessionSummary = SessionSummary.from(args);

        // then
        expect(sessionSummary.status).to.equal(SessionSummary.statuses.PROCESSED);
      });
    });
  });
});
