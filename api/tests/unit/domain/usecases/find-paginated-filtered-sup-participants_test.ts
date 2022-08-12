// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, sinon } = require('../../../test-helper');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const findPaginatedFilteredSupParticipants = require('../../../../lib/domain/usecases/find-paginated-filtered-sup-participants');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | UseCase | findPaginatedFilteredSupParticipants', function () {
  let supOrganizationParticipantRepository: $TSFixMe;
  const organizationId = 1;

  let foundSupParticipants;
  const expectedSupParticipants = {
    data: [{ id: 3 }],
  };

  // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
  beforeEach(function () {
    supOrganizationParticipantRepository = {
      findPaginatedFilteredSupParticipants: sinon.stub().returns(expectedSupParticipants),
    };
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('should fetch sup participants matching organization', async function () {
    foundSupParticipants = await findPaginatedFilteredSupParticipants({
      organizationId,
      filter: { lastName: 'A', group: 'L1' },
      page: { size: 10, number: 1 },
      supOrganizationParticipantRepository,
    });

    expect(supOrganizationParticipantRepository.findPaginatedFilteredSupParticipants).to.have.been.calledWithExactly({
      organizationId,
      filter: { lastName: 'A', group: 'L1' },
      page: { size: 10, number: 1 },
    });
    expect(foundSupParticipants).to.deep.equal(expectedSupParticipants);
  });
});
