// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, sinon } = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'sessionRes... Remove this comment to see the full error message
const sessionResultsLinkService = require('../../../../lib/domain/services/session-results-link-service');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'tokenServi... Remove this comment to see the full error message
const tokenService = require('../../../../lib/domain/services/token-service');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Domain | Service | Session Results Link Service', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#generateResultsLink', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return a valid download link', function () {
      // given
      const tokenServiceStub = sinon.stub(tokenService, 'createCertificationResultsLinkToken');
      tokenServiceStub.withArgs({ sessionId: 12345, daysBeforeExpiration: 30 }).returns('a_valid_token');

      // when
      const link = sessionResultsLinkService.generateResultsLink(12345);

      // then
      expect(link).to.deep.equal('https://app.pix.org/api/sessions/download-all-results/a_valid_token');
    });
  });
});
