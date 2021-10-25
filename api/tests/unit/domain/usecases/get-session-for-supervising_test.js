const { expect, sinon, domainBuilder } = require('../../../test-helper');
const getSessionForSupervising = require('../../../../lib/domain/usecases/get-session-for-supervising');

describe('Unit | UseCase | get-session-for-supervising', function () {
  context('when the session exists', function () {
    it('should get the session for supervising', async function () {
      // given
      const sessionToFind = domainBuilder.buildSessionForSupervising();
      const sessionForSupervisingRepository = { get: sinon.stub() };
      sessionForSupervisingRepository.get.withArgs(1).resolves(sessionToFind);

      // when
      const actualSession = await getSessionForSupervising({ sessionId: 1, sessionForSupervisingRepository });

      // then
      expect(actualSession).to.equal(sessionToFind);
    });
  });
});
