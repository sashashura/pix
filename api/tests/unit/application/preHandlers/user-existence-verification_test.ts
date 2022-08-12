// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, sinon, hFake } = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'userVerifi... Remove this comment to see the full error message
const userVerification = require('../../../../lib/application/preHandlers/user-existence-verification');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'userReposi... Remove this comment to see the full error message
const userRepository = require('../../../../lib/infrastructure/repositories/user-repository');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'errorSeria... Remove this comment to see the full error message
const errorSerializer = require('../../../../lib/infrastructure/serializers/jsonapi/validation-error-serializer');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'UserNotFou... Remove this comment to see the full error message
const { UserNotFoundError } = require('../../../../lib/domain/errors');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Pre-handler | User Verification', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#verifyById', function () {
    const request = {
      params: {
        id: 7,
      },
    };

    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(function () {
      sinon.stub(userRepository, 'get');
      sinon.stub(errorSerializer, 'serialize');
    });

    // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
    describe('When user exist', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should passthrough to handler', async function () {
        // given
        const userCount = 1;
        userRepository.get.resolves(userCount);

        // when
        const response = await userVerification.verifyById(request, hFake);

        // then
        sinon.assert.calledOnce(userRepository.get);
        sinon.assert.calledWith(userRepository.get, request.params.id);
        expect(response).to.equal(userCount);
      });
    });

    // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
    describe('When user doesn’t exist', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should reply 404 status with a serialized error and takeOver the request', async function () {
        // given
        userRepository.get.rejects(new UserNotFoundError());
        const serializedError = { serialized: 'error' };
        errorSerializer.serialize.returns(serializedError);

        // when
        const response = await userVerification.verifyById(request, hFake);

        // then
        expect(response.source).to.deep.equal(serializedError);
        expect(response.isTakeOver).to.be.true;
        expect(response.statusCode).to.equal(404);
      });
    });
  });
});
