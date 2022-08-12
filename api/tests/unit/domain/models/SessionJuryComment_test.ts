// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'SessionJur... Remove this comment to see the full error message
const SessionJuryComment = require('../../../../lib/domain/models/SessionJuryComment');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, domainBuilder, sinon } = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');

const SESSION_JURY_COMMENT_PROPS = ['id', 'comment', 'authorId', 'updatedAt'];

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Domain | Models | SessionJuryComment', function () {
  let comment: $TSFixMe;

  // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
  beforeEach(function () {
    comment = new SessionJuryComment({
      id: 1,
      comment: 'Un commentaire du pôle certif',
      authorId: 2,
      updatedAt: new Date(),
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('should create an object of the Session type', function () {
    expect(comment).to.be.instanceOf(SessionJuryComment);
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('should create a session with all the requires properties', function () {
    expect(_.keys(comment)).to.have.deep.members(SESSION_JURY_COMMENT_PROPS);
  });

  // @ts-expect-error TS(2304): Cannot find name 'context'.
  context('#update', function () {
    let clock: $TSFixMe;

    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(function () {
      clock = sinon.useFakeTimers(new Date('2003-04-05T03:04:05Z'));
    });

    // @ts-expect-error TS(2304): Cannot find name 'afterEach'.
    afterEach(function () {
      clock.restore();
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should update the comment', function () {
      // given
      const comment = domainBuilder.buildSessionJuryComment({
        id: 789,
        comment: 'Le commentaire original',
        authorId: 321,
        updatedAt: new Date('2001-02-03T01:02:03Z'),
      });

      // when
      comment.update({
        comment: 'Un autre commentaire',
        authorId: 456,
      });

      // then
      const expectedComment = domainBuilder.buildSessionJuryComment({
        id: 789,
        comment: 'Un autre commentaire',
        authorId: 456,
        updatedAt: new Date('2003-04-05T03:04:05Z'),
      });
      expect(comment).to.deepEqualInstance(expectedComment);
    });
  });
});
