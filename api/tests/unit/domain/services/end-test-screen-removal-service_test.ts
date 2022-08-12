// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, sinon } = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'endTestScr... Remove this comment to see the full error message
const endTestScreenRemovalRepository = require('../../../../lib/infrastructure/repositories/end-test-screen-removal-repository');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'endTestScr... Remove this comment to see the full error message
const endTestScreenRemovalService = require('../../../../lib/domain/services/end-test-screen-removal-service');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Domain | Service | EndTestScreenRemoval', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#isEndTestScreenRemovalEnabledBySessionId', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return value from repository', async function () {
      // given
      const sessionId = Symbol('sessionId');
      sinon.stub(endTestScreenRemovalRepository, 'isEndTestScreenRemovalEnabledBySessionId');
      endTestScreenRemovalRepository.isEndTestScreenRemovalEnabledBySessionId.withArgs(sessionId).resolves(false);

      // when
      const isEndTestScreenRemovalEnabled = await endTestScreenRemovalService.isEndTestScreenRemovalEnabledBySessionId(
        sessionId
      );

      // then
      expect(isEndTestScreenRemovalEnabled).to.equals(false);
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#isEndTestScreenRemovalEnabledByCandidateId', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return value from repository', async function () {
      // given
      const candidateId = Symbol('candidateId');
      sinon.stub(endTestScreenRemovalRepository, 'isEndTestScreenRemovalEnabledByCandidateId');
      endTestScreenRemovalRepository.isEndTestScreenRemovalEnabledByCandidateId.withArgs(candidateId).resolves(false);

      // when
      const isEndTestScreenRemovalEnabled =
        await endTestScreenRemovalService.isEndTestScreenRemovalEnabledByCandidateId(candidateId);

      // then
      expect(isEndTestScreenRemovalEnabled).to.equals(false);
    });

    // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
    describe('#isEndTestScreenRemovalEnabledByCertificationCenterId', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return value from repository', async function () {
        // given
        const certificationCenterId = Symbol('certificationCenterId');
        sinon.stub(endTestScreenRemovalRepository, 'isEndTestScreenRemovalEnabledByCertificationCenterId');
        endTestScreenRemovalRepository.isEndTestScreenRemovalEnabledByCertificationCenterId
          .withArgs(certificationCenterId)
          .resolves(false);

        // when
        const isEndTestScreenRemovalEnabled =
          await endTestScreenRemovalService.isEndTestScreenRemovalEnabledByCertificationCenterId(certificationCenterId);

        // then
        expect(isEndTestScreenRemovalEnabled).to.equals(false);
      });
    });

    // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
    describe('#isEndTestScreenRemovalEnabledForSomeCertificationCenter', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return value from repository', async function () {
        // given
        sinon.stub(endTestScreenRemovalRepository, 'isEndTestScreenRemovalEnabledForSomeCertificationCenter');
        endTestScreenRemovalRepository.isEndTestScreenRemovalEnabledForSomeCertificationCenter.resolves(false);

        // when
        const isEndTestScreenRemovalEnabled =
          await endTestScreenRemovalService.isEndTestScreenRemovalEnabledForSomeCertificationCenter();

        // then
        expect(isEndTestScreenRemovalEnabled).to.equals(false);
      });
    });
  });
});
