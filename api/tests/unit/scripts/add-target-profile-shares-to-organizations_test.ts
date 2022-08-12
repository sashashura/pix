// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, sinon } = require('../../test-helper');

const {
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'addTargetP... Remove this comment to see the full error message
  addTargetProfileSharesToOrganizations,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'checkData'... Remove this comment to see the full error message
  checkData,
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
} = require('../../../scripts/prod/add-target-profile-shares-to-organizations');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'targetProf... Remove this comment to see the full error message
const targetProfileShareRepository = require('../../../lib/infrastructure/repositories/target-profile-share-repository');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Acceptance | Scripts | add-target-profile-shares-to-organizations.js', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#addTargetProfileSharesToOrganizations', function () {
    let targetProfileShareRepositoryStub: $TSFixMe;
    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(function () {
      targetProfileShareRepositoryStub = sinon
        .stub(targetProfileShareRepository, 'addTargetProfilesToOrganization')
        .resolves({});
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should add target profile shares to the given organization', async function () {
      // given
      const organizationsByExternalId = {
        A100: {
          id: 1,
          name: 'Lycée Jean Moulin',
          'external-id': 'A100',
        },
        B200: {
          id: 2,
          name: 'Lycée Jean Guedin',
          'external-id': 'B200',
        },
      };

      const checkedData = [
        { externalId: 'A100', targetProfileIdList: ['1', '2', '999'] },
        { externalId: 'B200', targetProfileIdList: ['1', '3', '6'] },
      ];

      // when
      await addTargetProfileSharesToOrganizations({ organizationsByExternalId, checkedData });

      // then
      expect(targetProfileShareRepositoryStub).to.have.been.calledTwice;
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
          externalId: 'a100',
          targetProfileIdList: ['1', '2', '999'],
        },
        {
          externalId: 'b200',
          targetProfileIdList: ['1', '3', '6'],
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
      const csvData = [
        ['a100', '1-2-999'],
        ['', ''],
      ];

      const expectedResult = [
        {
          externalId: 'a100',
          targetProfileIdList: ['1', '2', '999'],
        },
      ];

      // when
      const result = await checkData({ csvData });

      // then
      expect(result).to.deep.have.members(expectedResult);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should keep only one data when an externalId is missing', async function () {
      // given
      const csvData = [
        ['a100', '1-2-999'],
        ['', '1-3-6'],
      ];

      const expectedResult = [
        {
          externalId: 'a100',
          targetProfileIdList: ['1', '2', '999'],
        },
      ];

      // when
      const result = await checkData({ csvData });

      // then
      expect(result).to.deep.have.members(expectedResult);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should keep only one data when targetProfileIds is missing', async function () {
      // given
      const csvData = [
        ['A100', '1-2-999'],
        ['b200', ''],
      ];

      const expectedResult = [
        {
          externalId: 'A100',
          targetProfileIdList: ['1', '2', '999'],
        },
      ];

      // when
      const result = await checkData({ csvData });

      // then
      expect(result).to.deep.have.members(expectedResult);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should keep all data except the empty targetProfileId', async function () {
      // given
      const csvData = [
        ['A100', '1-2-999'],
        ['b200', '1-3-'],
      ];

      const expectedResult = [
        {
          externalId: 'A100',
          targetProfileIdList: ['1', '2', '999'],
        },
        {
          externalId: 'b200',
          targetProfileIdList: ['1', '3'],
        },
      ];

      // when
      const result = await checkData({ csvData });

      // then
      expect(result).to.deep.have.members(expectedResult);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should accept spaces', async function () {
      // given
      const csvData = [
        ['a100', '1-2-999'],
        ['b200', '1 - 3 - 6'],
      ];

      const expectedResult = [
        {
          externalId: 'a100',
          targetProfileIdList: ['1', '2', '999'],
        },
        {
          externalId: 'b200',
          targetProfileIdList: ['1 ', ' 3 ', ' 6'],
        },
      ];

      // when
      const result = await checkData({ csvData });

      // then
      expect(result).to.deep.have.members(expectedResult);
    });
  });
});
