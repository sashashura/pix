// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, sinon } = require('../../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'competence... Remove this comment to see the full error message
const competenceDatasource = require('../../../../../lib/infrastructure/datasources/learning-content/competence-datasource');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'lcms'.
const lcms = require('../../../../../lib/infrastructure/lcms');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'cache'.
const cache = require('../../../../../lib/infrastructure/caches/learning-content-cache');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Infrastructure | Datasource | Learning Content | CompetenceDatasource', function () {
  // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
  beforeEach(function () {
    sinon.stub(cache, 'get').callsFake((generator: $TSFixMe) => generator());
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#findByRecordIds', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return an array of matching competence data objects', async function () {
      // given
      const rawCompetence1 = { id: 'RECORD_ID_RAW_COMPETENCE_1' };
      const rawCompetence2 = { id: 'RECORD_ID_RAW_COMPETENCE_2' };
      const rawCompetence3 = { id: 'RECORD_ID_RAW_COMPETENCE_3' };
      const rawCompetence4 = { id: 'RECORD_ID_RAW_COMPETENCE_4' };

      const records = [rawCompetence1, rawCompetence2, rawCompetence3, rawCompetence4];
      sinon.stub(lcms, 'getLatestRelease').resolves({ competences: records });
      const expectedCompetenceIds = [rawCompetence1.id, rawCompetence2.id, rawCompetence4.id];

      // when
      const foundCompetences = await competenceDatasource.findByRecordIds(expectedCompetenceIds);
      // then
      expect(foundCompetences.map(({
        id
      }: $TSFixMe) => id)).to.deep.equal(expectedCompetenceIds);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return an empty array when there are no objects matching the ids', async function () {
      // given
      const rawCompetence1 = { id: 'RECORD_ID_RAW_COMPETENCE_1' };

      const records = [rawCompetence1];
      sinon.stub(lcms, 'getLatestRelease').resolves({ competences: records });

      // when
      const foundCompetences = await competenceDatasource.findByRecordIds(['some_other_id']);

      // then
      expect(foundCompetences).to.be.empty;
    });
  });
});
