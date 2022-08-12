// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, sinon, hFake } = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'usecases'.
const usecases = require('../../../../lib/domain/usecases');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'lcmsContro... Remove this comment to see the full error message
const lcmsController = require('../../../../lib/application/lcms/lcms-controller');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Controller | lcms-controller', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#createRelease', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should call the createRelease', async function () {
      // given
      sinon.stub(usecases, 'createLcmsRelease').resolves();
      const request = {};

      // when
      await lcmsController.createRelease(request, hFake);

      // then
      expect(usecases.createLcmsRelease).to.have.been.called;
    });
  });
});
