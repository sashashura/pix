// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'sinon'.
const { sinon, expect } = require('../../../test-helper');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'usecases'.
const usecases = require('../../../../lib/domain/usecases');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'prescriber... Remove this comment to see the full error message
const prescriberSerializer = require('../../../../lib/infrastructure/serializers/jsonapi/prescriber-serializer');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'prescriber... Remove this comment to see the full error message
const prescriberController = require('../../../../lib/application/prescribers/prescriber-controller');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Controller | prescriber-controller', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#get', function () {
    let request: $TSFixMe;

    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(function () {
      request = { auth: { credentials: { userId: 1 } } };

      sinon.stub(usecases, 'getPrescriber');
      sinon.stub(prescriberSerializer, 'serialize');
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should get the prescriber', async function () {
      // given
      usecases.getPrescriber.withArgs({ userId: 1 }).resolves({});
      prescriberSerializer.serialize.withArgs({}).returns('ok');

      // when
      const response = await prescriberController.get(request);

      // then
      expect(response).to.be.equal('ok');
    });
  });
});
