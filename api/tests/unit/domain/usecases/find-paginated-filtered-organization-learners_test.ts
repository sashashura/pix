// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, sinon } = require('../../../test-helper');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const findPaginatedFilteredOrganizationLearners = require('../../../../lib/domain/usecases/find-paginated-filtered-organization-learners');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | UseCase | findPaginatedFilteredOrganizationLearners', function () {
  const organizationId = 1;
  const userId = 2;
  const username = 'username';
  const email = 'email@example.net';
  const isAuthenticatedFromGAR = true;

  const expectedOrganizationLearnerNotYetReconciled = { id: 3 };
  const expectedReconciledOrganizationLearnerWithUsername = { id: 4, userId, username };
  const expectedReconciledOrganizationLearnerWithEmail = { id: 5, userId, email };
  const expectedReconciledOrganizationLearnerFromGAR = { id: 5, userId, isAuthenticatedFromGAR };
  let foundOrganizationOrganizationLearners;
  const expectedOrganizationLearners = {
    data: [
      expectedOrganizationLearnerNotYetReconciled,
      expectedReconciledOrganizationLearnerWithUsername,
      expectedReconciledOrganizationLearnerWithEmail,
      expectedReconciledOrganizationLearnerFromGAR,
    ],
  };
  // TODO: Fix this the next time the file is edited.
  const organizationLearnerRepository = {
    // eslint-disable-next-line mocha/no-setup-in-describe
    findPaginatedFilteredOrganizationLearners: sinon.stub().returns(expectedOrganizationLearners),
  };

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('should fetch students matching organization', async function () {
    foundOrganizationOrganizationLearners = await findPaginatedFilteredOrganizationLearners({
      organizationId,
      filter: { lastName: 'A', group: 'L1' },
      page: { size: 10, number: 1 },
      organizationLearnerRepository,
    });

    expect(organizationLearnerRepository.findPaginatedFilteredOrganizationLearners).to.have.been.calledWithExactly({
      organizationId,
      filter: { lastName: 'A', group: 'L1' },
      page: { size: 10, number: 1 },
    });
    expect(foundOrganizationOrganizationLearners).to.deep.equal(expectedOrganizationLearners);
  });
});
