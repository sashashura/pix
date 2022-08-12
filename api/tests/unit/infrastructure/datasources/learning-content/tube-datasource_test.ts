// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, sinon } = require('../../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'lcms'.
const lcms = require('../../../../../lib/infrastructure/lcms');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'tubeDataso... Remove this comment to see the full error message
const tubeDatasource = require('../../../../../lib/infrastructure/datasources/learning-content/tube-datasource');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'cache'.
const cache = require('../../../../../lib/infrastructure/caches/learning-content-cache');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Infrastructure | Datasource | Learning Content | TubeDatasource', function () {
  // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
  beforeEach(function () {
    sinon.stub(cache, 'get').callsFake((generator: $TSFixMe) => generator());
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#findByNames', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return an array of matching tube data objects', async function () {
      // given
      const rawTube1 = { id: 'rectTube1', name: 'FAKE_NAME_RAW_TUBE_1' };
      const rawTube2 = { id: 'rectTube2', name: 'FAKE_NAME_RAW_TUBE_2' };
      const rawTube3 = { id: 'rectTube3', name: 'FAKE_NAME_RAW_TUBE_3' };
      const rawTube4 = { id: 'rectTube4', name: 'FAKE_NAME_RAW_TUBE_4' };

      const records = [rawTube1, rawTube2, rawTube3, rawTube4];
      sinon.stub(lcms, 'getLatestRelease').resolves({ tubes: records });

      // when
      const foundTubes = await tubeDatasource.findByNames([rawTube1.name, rawTube2.name, rawTube4.name]);

      // then
      expect(foundTubes).to.be.an('array');
      expect(_.map(foundTubes, 'name')).to.deep.equal([rawTube1.name, rawTube2.name, rawTube4.name]);
      expect(lcms.getLatestRelease).to.have.been.called;
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#findByRecordIds', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return an array of matching tube data objects', async function () {
      // given
      const rawTube1 = { id: 'RECORD_ID_RAW_TUBE_1' };
      const rawTube2 = { id: 'RECORD_ID_RAW_TUBE_2' };
      const rawTube3 = { id: 'RECORD_ID_RAW_TUBE_3' };
      const rawTube4 = { id: 'RECORD_ID_RAW_TUBE_4' };

      const records = [rawTube1, rawTube2, rawTube3, rawTube4];
      sinon.stub(lcms, 'getLatestRelease').resolves({ tubes: records });
      const expectedTubeIds = [rawTube1.id, rawTube2.id, rawTube4.id];

      // when
      const foundTubes = await tubeDatasource.findByRecordIds(expectedTubeIds);
      // then
      expect(foundTubes.map(({
        id
      }: $TSFixMe) => id)).to.deep.equal(expectedTubeIds);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return an empty array when there are no objects matching the ids', async function () {
      // given
      const rawTube1 = { id: 'RECORD_ID_RAW_TUBE_1' };

      const records = [rawTube1];
      sinon.stub(lcms, 'getLatestRelease').resolves({ tubes: records });

      // when
      const foundTubes = await tubeDatasource.findByRecordIds(['some_other_id']);

      // then
      expect(foundTubes).to.be.empty;
    });
  });
});
