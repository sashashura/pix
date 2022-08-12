// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, sinon } = require('../../../test-helper');

const {
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'findOrgani... Remove this comment to see the full error message
  findOrganizationsByExternalIds,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'organizeOr... Remove this comment to see the full error message
  organizeOrganizationsByExternalId,
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
} = require('../../../../scripts/helpers/organizations-by-external-id-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'organizati... Remove this comment to see the full error message
const organizationRepository = require('../../../../lib/infrastructure/repositories/organization-repository');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Scripts | organizations-by-external-id-helper.js', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#organizeOrganizationsByExternalId', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return organizations data by externalId', function () {
      // given
      const organizations = [
        { id: 1, externalId: 'a100' },
        { id: 2, externalId: 'b200' },
      ];

      const expectedResult = {
        a100: {
          id: 1,
          externalId: 'a100',
        },
        b200: {
          id: 2,
          externalId: 'b200',
        },
      };

      // when
      const result = organizeOrganizationsByExternalId(organizations);

      // then
      expect(result).to.deep.equal(expectedResult);
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#findOrganizationsByExternalIds', function () {
    let organizationRepositoryStub;

    // @ts-expect-error TS(2304): Cannot find name 'afterEach'.
    afterEach(function () {
      sinon.restore();
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should find organizations with given externalIds', async function () {
      // given
      const checkedData = [
        { externalId: 'A100', targetProfileIdList: ['1', '2', '999'] },
        { externalId: 'B200', targetProfileIdList: ['1', '3', '6'] },
      ];
      organizationRepositoryStub = sinon
        .stub(organizationRepository, 'findByExternalIdsFetchingIdsOnly')
        .withArgs(['A100', 'B200'])
        .resolves([]);

      // when
      await findOrganizationsByExternalIds({ checkedData });

      // then
      expect(organizationRepositoryStub).to.have.been.calledOnce;
    });
  });
});
