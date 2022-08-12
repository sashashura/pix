// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, sinon } = require('../../../test-helper');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'findDivisi... Remove this comment to see the full error message
const findDivisionsByOrganization = require('../../../../lib/domain/usecases/find-groups-by-organization');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | UseCase | find-groups-by-organization', function () {
  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('should return all groups', async function () {
    // given
    const groupRepository = {
      findByOrganizationId: sinon.stub(),
    };
    const organizationId = 1234;
    groupRepository.findByOrganizationId
      .withArgs({ organizationId })
      .resolves([{ name: '3a' }, { name: '3b' }, { name: '5c' }]);

    // when
    const groups = await findDivisionsByOrganization({
      organizationId,
      groupRepository,
    });

    // then
    expect(groups).to.be.deep.equal([{ name: '3a' }, { name: '3b' }, { name: '5c' }]);
  });
});
