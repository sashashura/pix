// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Session'.
const Session = require('../../../../lib/domain/models/Session');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect } = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'domainBuil... Remove this comment to see the full error message
const { domainBuilder } = require('../../../test-helper');

const SESSION_PROPS = [
  'id',
  'accessCode',
  'address',
  'certificationCenter',
  'date',
  'description',
  'examiner',
  'room',
  'time',
  'examinerGlobalComment',
  'hasIncident',
  'hasJoiningIssue',
  'finalizedAt',
  'resultsSentToPrescriberAt',
  'publishedAt',
  'certificationCandidates',
  'certificationCenterId',
  'assignedCertificationOfficerId',
  'supervisorPassword',
];

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Domain | Models | Session', function () {
  let session: $TSFixMe;

  // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
  beforeEach(function () {
    session = new Session({
      id: 'id',
      accessCode: '',
      address: '',
      certificationCenter: '',
      date: '',
      description: '',
      examiner: '',
      room: '',
      time: '',
      examinerGlobalComment: '',
      hasIncident: '',
      hasJoiningIssue: '',
      finalizedAt: '',
      resultsSentToPrescriberAt: '',
      publishedAt: '',
      // includes
      certificationCandidates: [],
      // references
      certificationCenterId: '',
      assignedCertificationOfficerId: '',
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('should create an object of the Session type', function () {
    expect(session).to.be.instanceOf(Session);
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('should create a session with all the requires properties', function () {
    expect(_.keys(session)).to.have.deep.members(SESSION_PROPS);
  });

  // @ts-expect-error TS(2304): Cannot find name 'context'.
  context('#areResultsFlaggedAsSent', function () {
    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when session resultsSentToPrescriberAt timestamp is defined', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return true', function () {
        // given
        session.resultsSentToPrescriberAt = new Date();

        // when
        const areResultsFlaggedAsSent = session.areResultsFlaggedAsSent();

        // then
        expect(areResultsFlaggedAsSent).to.be.true;
      });
    });
    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when session resultsSentToPrescriberAt timestamp is falsy', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return false', function () {
        // given
        session.resultsSentToPrescriberAt = null;

        // when
        const areResultsFlaggedAsSent = session.areResultsFlaggedAsSent();

        // then
        expect(areResultsFlaggedAsSent).to.be.false;
      });
    });
  });

  // @ts-expect-error TS(2304): Cannot find name 'context'.
  context('#get status', function () {
    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when session publishedAt timestamp is defined', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return PROCESSED', function () {
        // given
        session.publishedAt = new Date();

        // when
        const status = session.status;

        // then
expect(status).to.equal((Session as $TSFixMe).statuses.PROCESSED);
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when session publishedAt timestamp is not defined', function () {
      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('when session assignedCertificationOfficerId is defined', function () {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should return IN_PROCESS', function () {
          // given
          session.assignedCertificationOfficerId = 123;

          // when
          const status = session.status;

          // then
expect(status).to.equal((Session as $TSFixMe).statuses.IN_PROCESS);
        });
      });

      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('when session assignedCertificationOfficerId is not defined', function () {
        // @ts-expect-error TS(2304): Cannot find name 'context'.
        context('when session finalizedAt timestamp is defined', function () {
          // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
          it('should return FINALIZED', function () {
            // given
            session.finalizedAt = new Date();

            // when
            const status = session.status;

            // then
expect(status).to.equal((Session as $TSFixMe).statuses.FINALIZED);
          });
        });

        // @ts-expect-error TS(2304): Cannot find name 'context'.
        context('when session finalizedAt timestamp is not defined', function () {
          // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
          it('should return CREATED', function () {
            // when
            const status = session.status;

            // then
expect(status).to.equal((Session as $TSFixMe).statuses.CREATED);
          });
        });
      });
    });
  });

  // @ts-expect-error TS(2304): Cannot find name 'context'.
  context('#isPublished', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('returns true when the session is published', function () {
      // given
      const session = domainBuilder.buildSession({ publishedAt: new Date() });
      // when
      const isPublished = session.isPublished();

      // then
      expect(isPublished).to.be.true;
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('returns false when the session is not published', function () {
      // given
      const session = domainBuilder.buildSession({ publishedAt: null });
      // when
      const isPublished = session.isPublished();

      // then
      expect(isPublished).to.be.false;
    });
  });

  // @ts-expect-error TS(2304): Cannot find name 'context'.
  context('#isAccessible', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('returns true when the session is created', function () {
      // given
      const session = domainBuilder.buildSession.created();

      // when
      const isAccessible = session.isAccessible();

      // then
      expect(isAccessible).to.be.true;
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('returns false when the session is finalized', function () {
      // given
      const session = domainBuilder.buildSession.finalized();

      // when
      const isAccessible = session.isAccessible();

      // then
      expect(isAccessible).to.be.false;
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('returns false when the session is in process', function () {
      // given
      const session = domainBuilder.buildSession.inProcess();

      // when
      const isAccessible = session.isAccessible();

      // then
      expect(isAccessible).to.be.false;
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('returns false when the session is processed', function () {
      // given
      const session = domainBuilder.buildSession.processed();

      // when
      const isAccessible = session.isAccessible();

      // then
      expect(isAccessible).to.be.false;
    });
  });

  // @ts-expect-error TS(2304): Cannot find name 'context'.
  context('#isSupervisable', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return true when the supervisor password match', function () {
      // given
      const session = domainBuilder.buildSession.created();
      session.generateSupervisorPassword();

      // when
      const isSupervisable = session.isSupervisable(session.supervisorPassword);

      // then
      expect(isSupervisable).to.be.true;
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return false when the supervisor password does not match', function () {
      // given
      const session = domainBuilder.buildSession.created();

      // when
      const isSupervisable = session.isSupervisable('NOT_MATCHING-SUPERVISOR_PASSWORD');

      // then
      expect(isSupervisable).to.be.false;
    });
  });

  // @ts-expect-error TS(2304): Cannot find name 'context'.
  context('#canEnrollCandidate', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return true when session is not finalized', function () {
      // given
      const session = domainBuilder.buildSession.created();

      // when
      const result = session.canEnrollCandidate();

      // then
      expect(result).to.be.true;
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return false when session is not finalized', function () {
      // given
      const session = domainBuilder.buildSession.finalized();

      // when
      const result = session.canEnrollCandidate();

      // then
      expect(result).to.be.false;
    });
  });
});

// @ts-expect-error TS(2304): Cannot find name 'context'.
context('#generateSupervisorPassword', function () {
  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('should return a supervisor password containing 5 digits/letters except 0, 1 and vowels', async function () {
    // when
    const session = domainBuilder.buildSession();
    session.generateSupervisorPassword();

    // then
    expect(session.supervisorPassword).to.match(/^[2346789BCDFGHJKMPQRTVWXY]{5}$/);
  });
});
