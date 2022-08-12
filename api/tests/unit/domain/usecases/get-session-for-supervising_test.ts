// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, sinon, domainBuilder } = require('../../../test-helper');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const getSessionForSupervising = require('../../../../lib/domain/usecases/get-session-for-supervising');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | UseCase | get-session-for-supervising', function () {
  // @ts-expect-error TS(2304): Cannot find name 'context'.
  context('when the session exists', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should fetch and return the session from repository', async function () {
      // given
      const expectedSession = domainBuilder.buildSessionForSupervising();
      const sessionForSupervisingRepository = { get: sinon.stub() };
      sessionForSupervisingRepository.get.resolves(expectedSession);

      // when
      const actualSession = await getSessionForSupervising({ sessionId: 1, sessionForSupervisingRepository });

      // then
      expect(actualSession).to.equal(expectedSession);
    });
  });
});
