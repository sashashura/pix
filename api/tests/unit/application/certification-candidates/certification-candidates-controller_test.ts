// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, sinon, hFake } = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'usecases'.
const usecases = require('../../../../lib/domain/usecases');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const certificationCandidateController = require('../../../../lib/application/certification-candidates/certification-candidates-controller');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'endTestScr... Remove this comment to see the full error message
const endTestScreenRemovalService = require('../../../../lib/domain/services/end-test-screen-removal-service');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Controller | certifications-candidate-controller', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#authorizeToStart', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return a 204 status code', async function () {
      // given
      const request = {
        auth: {
          credentials: { userId: '111' },
        },
        params: {
          id: 99,
        },
        payload: { 'authorized-to-start': true },
      };

      usecases.authorizeCertificationCandidateToStart = sinon.stub().rejects();
      usecases.authorizeCertificationCandidateToStart
        .withArgs({
          certificationCandidateForSupervisingId: 99,
          authorizedToStart: true,
        })
        .resolves();

      // when
      const response = await certificationCandidateController.authorizeToStart(request, hFake);

      // then
      expect(response.statusCode).to.equal(204);
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#authorizeToResume', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return a 204 status code', async function () {
      // given
      sinon.stub(endTestScreenRemovalService, 'isEndTestScreenRemovalEnabledByCandidateId');
      endTestScreenRemovalService.isEndTestScreenRemovalEnabledByCandidateId.withArgs(99).resolves(true);
      const request = {
        auth: {
          credentials: { userId: '111' },
        },
        params: {
          id: 99,
        },
      };

      usecases.authorizeCertificationCandidateToResume = sinon.stub().rejects();
      usecases.authorizeCertificationCandidateToResume
        .withArgs({
          certificationCandidateId: 99,
        })
        .resolves();

      // when
      const response = await certificationCandidateController.authorizeToResume(request, hFake);

      // then
      expect(response.statusCode).to.equal(204);
    });
  });
});

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('#endAssessmentBySupervisor', function () {
  const certificationCandidateId = 2;

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('should call the endAssessmentBySupervisor use case', async function () {
    // given
    sinon.stub(usecases, 'endAssessmentBySupervisor');
    usecases.endAssessmentBySupervisor.resolves();

    // when
    await certificationCandidateController.endAssessmentBySupervisor({
      params: { id: certificationCandidateId },
    });

    // then
    expect(usecases.endAssessmentBySupervisor).to.have.been.calledWithExactly({
      certificationCandidateId,
    });
  });
});
