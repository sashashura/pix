// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, sinon } = require('../../../test-helper');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const updateSession = require('../../../../lib/domain/usecases/update-session');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'sessionVal... Remove this comment to see the full error message
const sessionValidator = require('../../../../lib/domain/validators/session-validator');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | UseCase | update-session', function () {
  let originalSession: $TSFixMe;
  let sessionRepository: $TSFixMe;

  const certificationCenterId = 1;

  // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
  beforeEach(function () {
    originalSession = {
      id: 1,
      certificationCenter: 'Université de gastronomie Paul',
      certificationCenterId: certificationCenterId,
      address: 'Lyon',
      room: '28D',
      examiner: 'Joel R',
      date: '2017-12-08',
      time: '14:30',
      description: 'miam',
      accessCode: 'ABCD12',
    };
    sessionRepository = {
      get: sinon.stub(),
      updateSessionInfo: sinon.stub(),
    };
    sinon.stub(sessionValidator, 'validate');
    sessionRepository.get.withArgs(originalSession.id).resolves(originalSession);
    sessionRepository.updateSessionInfo.callsFake((updatedSession: $TSFixMe) => updatedSession);
    sessionValidator.validate.withArgs(originalSession).returns();
  });

  // @ts-expect-error TS(2304): Cannot find name 'context'.
  context('when session exists', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should update the session address only', function () {
      // given
      const updatedSession = {
        id: 1,
        certificationCenter: 'Université de gastronomie Paul',
        certificationCenterId: certificationCenterId,
        address: 'NEW ADDRESS',
        room: '28D',
        examiner: 'Joel R',
        date: '2017-12-08',
        time: '14:30',
        description: 'miam',
        accessCode: 'ABCD12',
      };

      // when
      const promise = updateSession({
        session: updatedSession,
        sessionRepository: sessionRepository,
      });

      // then
      return promise.then((resultSession: $TSFixMe) => {
        expect(sessionRepository.updateSessionInfo).to.have.been.calledWithExactly(updatedSession);
        expect(resultSession.address).to.equal(updatedSession.address);
      });
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should update the session address and examiner only', function () {
      // given
      const updatedSession = {
        id: 1,
        certificationCenter: 'Université de gastronomie Paul',
        certificationCenterId: certificationCenterId,
        address: 'NEW ADRESS',
        room: '28D',
        examiner: 'NEW EXAMINER',
        date: '2017-12-08',
        time: '14:30',
        description: 'miam',
        accessCode: 'ABCD12',
      };

      // when
      const promise = updateSession({
        session: updatedSession,
        sessionRepository: sessionRepository,
      });

      // then
      return promise.then((resultSession: $TSFixMe) => {
        expect(sessionRepository.updateSessionInfo).to.have.been.calledWithExactly(updatedSession);
        expect(resultSession.address).to.equal(updatedSession.address);
      });
    });
  });

  // @ts-expect-error TS(2304): Cannot find name 'context'.
  context('when an error occurred', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should throw an error when the session could not be retrieved', function () {
      // given
      sessionRepository.get.withArgs(originalSession.id).rejects();

      // when
      const promise = updateSession({
        session: originalSession,
        sessionRepository: sessionRepository,
      });

      // then
      return expect(promise).to.be.rejected;
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should throw an error when the payload is invalid', function () {
      // given
      sessionValidator.validate.withArgs(originalSession).throws();

      // when
      const promise = updateSession({
        session: originalSession,
        sessionRepository: sessionRepository,
      });

      // then
      return expect(promise).to.be.rejected;
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should throw an error when the session could not be updated', function () {
      // given
      sessionRepository.updateSessionInfo.withArgs(originalSession).rejects();

      // when
      const promise = updateSession({
        session: originalSession,
        sessionRepository: sessionRepository,
      });

      // then
      return expect(promise).to.be.rejected;
    });
  });
});
