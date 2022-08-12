// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'sinon'.
const { sinon, expect } = require('../../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'lcms'.
const lcms = require('../../../../../lib/infrastructure/lcms');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'thematicDa... Remove this comment to see the full error message
const thematicDatasource = require('../../../../../lib/infrastructure/datasources/learning-content/thematic-datasource');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Infrastructure | Datasource | Learning Content | ThematicDatasource', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#findByCompetenceIds', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return an array of matching learning content area data objects by framework ids', async function () {
      // given
      const records = [
        { id: 'recThematic0', competenceId: 'competence1' },
        { id: 'recThematic1', competenceId: 'competence2' },
        { id: 'recThematic3', competenceId: 'competence3' },
        { id: 'recThematic2', competenceId: 'competence1' },
      ];
      sinon.stub(lcms, 'getLatestRelease').resolves({ thematics: records });
      const expectedThematicIds = ['recThematic0', 'recThematic1', 'recThematic2'];
      const competenceIds = ['competence1', 'competence2'];

      // when
      const foundThematics = await thematicDatasource.findByCompetenceIds(competenceIds);
      // then
      expect(foundThematics.map(({
        id
      }: $TSFixMe) => id)).to.deep.equal(expectedThematicIds);
    });
  });
});
