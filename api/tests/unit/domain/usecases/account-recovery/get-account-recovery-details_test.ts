// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, sinon } = require('../../../../test-helper');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const getAccountRecoveryDetails = require('../../../../../lib/domain/usecases/account-recovery/get-account-recovery-details');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | UseCase | get-account-recovery-details', function () {
  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('should return new email and firstName of account recovery demand', async function () {
    // given
    const temporaryKey = 'ZHABCDEFJSJ';
    const organizationLearnerRepository = {
      get: sinon.stub(),
    };
    const scoAccountRecoveryService = {
      retrieveAndValidateAccountRecoveryDemand: sinon.stub(),
    };
    const organizationLearnerId = '4321';
    const newEmail = 'newemail@example.net';
    const firstName = 'Emma';

    scoAccountRecoveryService.retrieveAndValidateAccountRecoveryDemand.resolves({ organizationLearnerId, newEmail });
    organizationLearnerRepository.get.withArgs(organizationLearnerId).resolves({ firstName });

    // when
    const result = await getAccountRecoveryDetails({
      temporaryKey,
      organizationLearnerRepository,
      scoAccountRecoveryService,
    });

    // then
    expect(result.email).to.be.equal(newEmail);
    expect(result.firstName).to.be.equal(firstName);
  });
});
