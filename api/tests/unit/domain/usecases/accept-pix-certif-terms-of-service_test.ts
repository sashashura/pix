// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, sinon } = require('../../../test-helper');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const acceptPixCertifTermsOfService = require('../../../../lib/domain/usecases/accept-pix-certif-terms-of-service');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'userReposi... Remove this comment to see the full error message
const userRepository = require('../../../../lib/infrastructure/repositories/user-repository');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | UseCase | accept-pix-certif-terms-of-service', function () {
  // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
  beforeEach(function () {
    sinon.stub(userRepository, 'updatePixCertifTermsOfServiceAcceptedToTrue');
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('should accept terms of service of pix-certif', async function () {
    // given
    const userId = Symbol('userId');
    const updatedUser = Symbol('updateduser');
    userRepository.updatePixCertifTermsOfServiceAcceptedToTrue.resolves(updatedUser);

    // when
    const actualUpdatedUser = await acceptPixCertifTermsOfService({ userId, userRepository });

    // then
    expect(userRepository.updatePixCertifTermsOfServiceAcceptedToTrue).to.have.been.calledWith(userId);
    expect(actualUpdatedUser).to.equal(updatedUser);
  });
});
