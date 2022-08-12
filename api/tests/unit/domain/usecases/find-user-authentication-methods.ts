// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, sinon, domainBuilder } = require('../../../test-helper');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const findUserAuthenticationMethods = require('../../../../lib/domain/usecases/find-user-authentication-methods');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | UseCase | find-user-authentication-methods', function () {
  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('should find user authentication methods', async function () {
    // given
    const authenticationMethodRepository = {
      findByUserId: sinon.stub(),
    };

    const user = domainBuilder.buildUser();
    domainBuilder.buildAuthenticationMethod.withPoleEmploiAsIdentityProvider({ userId: user.id });

    // when
    await findUserAuthenticationMethods({ userId: user.id, authenticationMethodRepository });

    // then
    expect(authenticationMethodRepository.findByUserId).to.have.been.calledWith({ userId: user.id });
  });
});
