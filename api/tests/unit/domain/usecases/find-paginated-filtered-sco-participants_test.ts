// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, sinon } = require('../../../test-helper');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const findPaginatedFilteredScoParticipants = require('../../../../lib/domain/usecases/find-paginated-filtered-sco-participants');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | UseCase | findPaginatedFilteredScoParticipants', function () {
  let scoOrganizationParticipantRepository: $TSFixMe;
  const organizationId = 1;
  const userId = 2;
  const username = 'username';
  const email = 'email@example.net';
  const isAuthenticatedFromGAR = true;

  const expectedScoParticipantsNotYetReconciled = { id: 3 };
  const expectedReconciledScoParticipantsWithUsername = { id: 4, userId, username };
  const expectedReconciledScoParticipantsWithEmail = { id: 5, userId, email };
  const expectedReconciledScoParticipantsFromGAR = { id: 5, userId, isAuthenticatedFromGAR };
  let foundScoParticipants;
  const expectedScoParticipants = {
    data: [
      expectedScoParticipantsNotYetReconciled,
      expectedReconciledScoParticipantsWithUsername,
      expectedReconciledScoParticipantsWithEmail,
      expectedReconciledScoParticipantsFromGAR,
    ],
  };

  // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
  beforeEach(function () {
    scoOrganizationParticipantRepository = {
      findPaginatedFilteredScoParticipants: sinon.stub().returns(expectedScoParticipants),
    };
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('should fetch sco participants matching organization', async function () {
    foundScoParticipants = await findPaginatedFilteredScoParticipants({
      organizationId,
      filter: { lastName: 'A', division: '4A' },
      page: { size: 10, number: 1 },
      scoOrganizationParticipantRepository,
    });

    expect(scoOrganizationParticipantRepository.findPaginatedFilteredScoParticipants).to.have.been.calledWithExactly({
      organizationId,
      filter: { lastName: 'A', division: '4A' },
      page: { size: 10, number: 1 },
    });
    expect(foundScoParticipants).to.deep.equal(expectedScoParticipants);
  });
});
