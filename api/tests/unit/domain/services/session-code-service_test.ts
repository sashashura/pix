// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, sinon } = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'sessionCod... Remove this comment to see the full error message
const sessionCodeService = require('../../../../lib/domain/services/session-code-service');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'sessionRep... Remove this comment to see the full error message
const sessionRepository = require('../../../../lib/infrastructure/repositories/sessions/session-repository');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Service | CodeSession', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#isSessionCodeAvailable', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return a non ambiguous session code with 4 random capital letters and 2 random numbers', async function () {
      // given
      sinon.stub(sessionRepository, 'isSessionCodeAvailable').resolves(true);

      // when
      const result = await sessionCodeService.getNewSessionCode();

      // then
      expect(result).to.match(/[B,C,D,F,G,H,J,K,M,P,Q,R,T,V,W,X,Y]{4}[2,3,4,6,7,8,9]{2}/);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return a new code if first code was not unique', async function () {
      // given
      sinon.stub(sessionRepository, 'isSessionCodeAvailable').onCall(0).resolves(false).onCall(1).resolves(true);
      sinon
        .stub(_, 'sample')
        .returns('A')
        .onCall(6)
        .returns('B')
        .onCall(7)
        .returns('B')
        .onCall(8)
        .returns('B')
        .onCall(9)
        .returns('B')
        .onCall(10)
        .returns('2')
        .onCall(11)
        .returns('2');

      // when
      const result = await sessionCodeService.getNewSessionCode();

      // then
      expect(result).to.equal('BBBB22');
    });
  });
});
