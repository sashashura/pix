// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, sinon } = require('../../../test-helper');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'findDivisi... Remove this comment to see the full error message
const findDivisionsByOrganization = require('../../../../lib/domain/usecases/find-divisions-by-organization');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | UseCase | find-divisions-by-organization', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('when user has access to organization', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return all divisions', async function () {
      // given
      const divisionRepository = {
        findByOrganizationIdForCurrentSchoolYear: sinon.stub(),
      };
      const organizationId = 1234;
      divisionRepository.findByOrganizationIdForCurrentSchoolYear
        .withArgs({ organizationId })
        .resolves([{ name: '3a' }, { name: '3b' }, { name: '5c' }]);

      // when
      const divisions = await findDivisionsByOrganization({
        organizationId,
        divisionRepository,
      });

      // then
      expect(divisions).to.be.deep.equal([{ name: '3a' }, { name: '3b' }, { name: '5c' }]);
    });
  });
});
