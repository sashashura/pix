// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, sinon, catchErr } = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'noop'.
const { noop } = require('lodash/noop');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const createSession = require('../../../../lib/domain/usecases/create-session');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'sessionCod... Remove this comment to see the full error message
const sessionCodeService = require('../../../../lib/domain/services/session-code-service');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'sessionVal... Remove this comment to see the full error message
const sessionValidator = require('../../../../lib/domain/validators/session-validator');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'ForbiddenA... Remove this comment to see the full error message
const { ForbiddenAccess } = require('../../../../lib/domain/errors');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Session'.
const Session = require('../../../../lib/domain/models/Session');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | UseCase | create-session', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#save', function () {
    const userId = 'userId';
    const certificationCenterId = 'certificationCenterId';
    const certificationCenterName = 'certificationCenterName';
    const certificationCenter = { id: certificationCenterId, name: certificationCenterName };
    const sessionToSave = { certificationCenterId };
    const certificationCenterRepository = { get: noop };
    const sessionRepository = { save: noop };
    const userRepository = { getWithCertificationCenterMemberships: noop };
    const userWithMemberships = { hasAccessToCertificationCenter: noop };

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when session is not valid', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should throw an error', function () {
        sinon.stub(sessionValidator, 'validate').throws();
        const promise = createSession({
          userId,
          session: sessionToSave,
          certificationCenterRepository,
          sessionRepository,
          userRepository,
        });

        // then
        expect(promise).to.be.rejected;
        expect(sessionValidator.validate).to.have.been.calledWithExactly(sessionToSave);
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when session is valid', function () {
      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('when user has no certification center membership', function () {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should throw a Forbidden error', async function () {
          // given
          userWithMemberships.hasAccessToCertificationCenter = sinon.stub();
          userWithMemberships.hasAccessToCertificationCenter.withArgs(certificationCenterId).returns(false);
          userRepository.getWithCertificationCenterMemberships = sinon.stub();
          userRepository.getWithCertificationCenterMemberships.withArgs(userId).returns(userWithMemberships);
          sinon.stub(sessionValidator, 'validate').throws();
          sessionValidator.validate.returns();

          // when
          // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
          const error = await catchErr(createSession)({
            userId,
            session: sessionToSave,
            certificationCenterRepository,
            sessionRepository,
            userRepository,
          });

          // then
          expect(error).to.be.instanceOf(ForbiddenAccess);
        });
      });

      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('when user has certification center membership', function () {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should save the session with appropriate arguments', async function () {
          // given
          const accessCode = Symbol('accessCode');
          sinon.stub(sessionValidator, 'validate').throws();
          sinon.stub(sessionCodeService, 'getNewSessionCode').throws();
          userWithMemberships.hasAccessToCertificationCenter = sinon.stub();
          userRepository.getWithCertificationCenterMemberships = sinon.stub();
          certificationCenterRepository.get = sinon.stub();

          sessionRepository.save = sinon.stub();
          userWithMemberships.hasAccessToCertificationCenter.withArgs(certificationCenterId).returns(true);
          userRepository.getWithCertificationCenterMemberships.withArgs(userId).returns(userWithMemberships);
          sessionCodeService.getNewSessionCode.resolves(accessCode);
          certificationCenterRepository.get.withArgs(certificationCenterId).resolves(certificationCenter);
          sessionRepository.save.resolves();
          sessionValidator.validate.returns();

          // when
          await createSession({
            userId,
            session: sessionToSave,
            certificationCenterRepository,
            sessionRepository,
            userRepository,
          });

          // then
          const expectedSession = new Session({
            certificationCenterId,
            certificationCenter: certificationCenterName,
            accessCode,
            supervisorPassword: sinon.match(/^[2346789BCDFGHJKMPQRTVWXY]{5}$/),
          });

          expect(sessionRepository.save).to.have.been.calledWithExactly(expectedSession);
        });
      });
    });
  });
});
