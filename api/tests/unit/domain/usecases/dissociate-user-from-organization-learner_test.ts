// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, sinon, domainBuilder, catchErr } = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'usecases'.
const usecases = require('../../../../lib/domain/usecases');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Organizati... Remove this comment to see the full error message
const { OrganizationLearnerCannotBeDissociatedError } = require('../../../../lib/domain/errors');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | UseCase | dissociate-user-from-organization-learner', function () {
  const organizationId = 1;
  const organizationLearnerId = 2;

  let organizationLearnerRepositoryStub: $TSFixMe;

  // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
  beforeEach(function () {
    domainBuilder.buildOrganizationLearner({
      organization: { id: organizationId },
      id: organizationLearnerId,
    });

    organizationLearnerRepositoryStub = {
      dissociateUserFromOrganizationLearner: sinon.stub(),
      getOrganizationLearnerForAdmin: sinon.stub(),
    };
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('should dissociate user from the organization learner', async function () {
    // given
    organizationLearnerRepositoryStub.getOrganizationLearnerForAdmin.resolves({ canBeDissociated: true });

    // when
    await usecases.dissociateUserFromOrganizationLearner({
      organizationLearnerId,
      organizationLearnerRepository: organizationLearnerRepositoryStub,
    });

    // then
    expect(organizationLearnerRepositoryStub.dissociateUserFromOrganizationLearner).to.be.have.been.calledWith(
      organizationLearnerId
    );
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('should throw an error when organization learner cannot be dissociated', async function () {
    // given
    organizationLearnerRepositoryStub.getOrganizationLearnerForAdmin.resolves({ canBeDissociated: false });

    // when
    // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
    const error = await catchErr(usecases.dissociateUserFromOrganizationLearner)({
      organizationLearnerId,
      organizationLearnerRepository: organizationLearnerRepositoryStub,
    });

    // then
    expect(error).to.be.instanceOf(OrganizationLearnerCannotBeDissociatedError);
  });
});
