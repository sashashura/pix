// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, nock } = require('../../test-helper');

const {
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'checkData'... Remove this comment to see the full error message
  checkData,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'updateOrga... Remove this comment to see the full error message
  updateOrganizations,
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
} = require('../../../scripts/update-sco-organizations-with-is-managing-students-to-true');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Scripts | update-sco-organizations-with-is-managing-students-to-true.js', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#updateOrganizations', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should update organizations', async function () {
      // given
      const accessToken = 'token';

      const organizationsByExternalId = {
        A100: {
          id: 1,
          'is-managing-students': false,
        },
      };

      const checkedData = [{ externalId: 'A100' }];

      const expectedPatchBody = {
        data: {
          type: 'organizations',
          id: 1,
          attributes: {
            'is-managing-students': true,
          },
        },
      };

      let patchCallCount = 0;

      const networkStub = nock('http://localhost:3000', {
        reqheaders: {
          authorization: 'Bearer token',
        },
      })
        .patch('/api/organizations/1', (body: $TSFixMe) => JSON.stringify(body) === JSON.stringify(expectedPatchBody))
        .reply(204, () => {
          patchCallCount++;

          return {};
        });

      // when
      await updateOrganizations({ accessToken, organizationsByExternalId, checkedData });

      // then
      expect(networkStub.isDone()).to.be.true;
      expect(patchCallCount).to.be.equal(1);
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#checkData', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should keep all data', async function () {
      // given
      const csvData = [
        ['a100', '1-2-999'],
        ['b200', '1-3-6'],
      ];

      const expectedResult = [
        {
          externalId: 'A100',
        },
        {
          externalId: 'B200',
        },
      ];

      // when
      const result = await checkData({ csvData });

      // then
      expect(result).to.deep.have.members(expectedResult);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should keep only one data when a whole line is empty', async function () {
      // given
      const csvData = [['a100'], ['']];

      const expectedResult = [
        {
          externalId: 'A100',
        },
      ];

      // when
      const result = await checkData({ csvData });

      // then
      expect(result).to.deep.have.members(expectedResult);
    });
  });
});
