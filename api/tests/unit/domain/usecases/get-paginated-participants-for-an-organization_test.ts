// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, sinon } = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'getPaginat... Remove this comment to see the full error message
const getPaginatedParticipantsForAnOrganization = require('../../../../lib/domain/usecases/get-paginated-participants-for-an-organization');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | UseCase | get-participants-by-organization-id', function () {
  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('should call organizationParticipantRepository', async function () {
    // given
    const organizationId = 90000;
    const page = {};
    const organizationParticipantRepository = {
      getParticipantsByOrganizationId: sinon.stub(),
    };
    const filters = {
      fullName: 'name',
    };

    // when
    await getPaginatedParticipantsForAnOrganization({
      organizationId,
      filters,
      page,
      organizationParticipantRepository,
    });

    // then
    expect(organizationParticipantRepository.getParticipantsByOrganizationId).to.have.been.calledWithExactly({
      organizationId,
      page,
      filters,
    });
  });
});
