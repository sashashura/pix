// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, sinon, hFake } = require('../../../test-helper');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const AssessmentAuthorization = require('../../../../lib/application/preHandlers/assessment-authorization');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'tokenServi... Remove this comment to see the full error message
const tokenService = require('../../../../lib/domain/services/token-service');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'assessment... Remove this comment to see the full error message
const assessmentRepository = require('../../../../lib/infrastructure/repositories/assessment-repository');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Pre-handler | Assessment Authorization', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#verify', function () {
    const request = {
      headers: { authorization: 'VALID_TOKEN' },
      params: {
        id: 8,
      },
    };

    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(function () {
      sinon.stub(tokenService, 'extractTokenFromAuthChain');
      sinon.stub(tokenService, 'extractUserId');
      sinon.stub(assessmentRepository, 'getByAssessmentIdAndUserId');
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should get userId from token', function () {
      // given
      tokenService.extractTokenFromAuthChain.returns('VALID_TOKEN');
      tokenService.extractUserId.returns('userId');
      assessmentRepository.getByAssessmentIdAndUserId.resolves();

      // when
      const promise = AssessmentAuthorization.verify(request, hFake);

      // then
      return promise.then(() => {
        sinon.assert.calledOnce(tokenService.extractUserId);
        sinon.assert.calledWith(tokenService.extractUserId, request.headers.authorization);
      });
    });

    // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
    describe('When assessment is linked to userId (userId exist)', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should reply with assessment', async function () {
        // given
        const fetchedAssessment = {};
        const extractedUserId = 'userId';
        tokenService.extractUserId.returns(extractedUserId);
        assessmentRepository.getByAssessmentIdAndUserId.resolves(fetchedAssessment);

        // when
        const response = await AssessmentAuthorization.verify(request, hFake);

        // then
        sinon.assert.calledOnce(assessmentRepository.getByAssessmentIdAndUserId);
        sinon.assert.calledWith(assessmentRepository.getByAssessmentIdAndUserId, request.params.id, extractedUserId);
        expect(response).to.deep.equal(fetchedAssessment);
      });
    });

    // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
    describe('When assessment is linked a null userId', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should reply with assessment', async function () {
        // given
        const fetchedAssessment = {};
        const extractedUserId = null;
        tokenService.extractUserId.returns(extractedUserId);
        assessmentRepository.getByAssessmentIdAndUserId.resolves(fetchedAssessment);

        // when
        const response = await AssessmentAuthorization.verify(request, hFake);

        // then
        sinon.assert.calledOnce(assessmentRepository.getByAssessmentIdAndUserId);
        sinon.assert.calledWith(assessmentRepository.getByAssessmentIdAndUserId, request.params.id, extractedUserId);
        expect(response).to.deep.equal(fetchedAssessment);
      });
    });

    // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
    describe('When userId (from token) is not linked to assessment', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should take over the request and response with 401 status code', async function () {
        // given
        const extractedUserId = null;
        tokenService.extractUserId.returns(extractedUserId);
        assessmentRepository.getByAssessmentIdAndUserId.rejects();
        // when
        const response = await AssessmentAuthorization.verify(request, hFake);

        // then
        expect(response.statusCode).to.equal(401);
        expect(response.isTakeOver).to.be.true;
      });
    });
  });
});
