// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, sinon } = require('../../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'areaDataso... Remove this comment to see the full error message
const areaDatasource = require('../../../../../lib/infrastructure/datasources/learning-content/area-datasource');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'lcms'.
const lcms = require('../../../../../lib/infrastructure/lcms');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Infrastructure | Datasource | Learning Content | AreaDatasource', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#findByRecordIds', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return an array of matching learning content area data objects', async function () {
      // given
      const records = [{ id: 'recArea0' }, { id: 'recArea1' }, { id: 'recArea2' }];
      sinon.stub(lcms, 'getLatestRelease').resolves({ areas: records });
      const expectedAreaIds = ['recArea0', 'recArea1'];

      // when
      const foundAreas = await areaDatasource.findByRecordIds(expectedAreaIds);
      // then
      expect(foundAreas.map(({
        id
      }: $TSFixMe) => id)).to.deep.equal(expectedAreaIds);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return an empty array when there are no objects matching the ids', async function () {
      // given
      const records = [{ id: 'recArea0' }];
      sinon.stub(lcms, 'getLatestRelease').resolves({ areas: records });

      // when
      const foundAreas = await areaDatasource.findByRecordIds(['some_other_id']);

      // then
      expect(foundAreas).to.be.empty;
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#findByFrameworkId', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return an array of matching learning content area data objects by framework id', async function () {
      // given
      const records = [
        { id: 'recArea0', frameworkId: 'framework1' },
        { id: 'recArea1', frameworkId: 'framework2' },
        { id: 'recArea2', frameworkId: 'framework1' },
      ];
      sinon.stub(lcms, 'getLatestRelease').resolves({ areas: records });
      const expectedAreaIds = ['recArea0', 'recArea2'];
      const frameworkId = 'framework1';

      // when
      const foundAreas = await areaDatasource.findByFrameworkId(frameworkId);
      // then
      expect(foundAreas.map(({
        id
      }: $TSFixMe) => id)).to.deep.equal(expectedAreaIds);
    });
  });
});
