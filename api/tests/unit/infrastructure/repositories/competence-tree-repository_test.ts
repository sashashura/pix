// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, sinon } = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'competence... Remove this comment to see the full error message
const competenceTreeRepository = require('../../../../lib/infrastructure/repositories/competence-tree-repository');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'areaReposi... Remove this comment to see the full error message
const areaRepository = require('../../../../lib/infrastructure/repositories/area-repository');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Competence... Remove this comment to see the full error message
const CompetenceTree = require('../../../../lib/domain/models/CompetenceTree');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Repository | competence-tree-repository', function () {
  // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
  beforeEach(function () {
    sinon.stub(areaRepository, 'listWithPixCompetencesOnly');
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#get', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return a competence tree populated with Areas and Competences', async function () {
      // given
      const area = {
        id: 'recvoGdo7z2z7pXWa',
        code: '1',
        name: '1. Information et données',
        title: 'Information et données',
        color: 'jaffa',
        competences: [
          {
            id: 'recsvLz0W2ShyfD63',
            name: 'Mener une recherche et une veille d’information',
          },
          {
            id: 'recNv8qhaY887jQb2',
            name: 'Mener une recherche et une veille d’information',
          },
        ],
      };

      areaRepository.listWithPixCompetencesOnly.withArgs({ locale: 'fr' }).resolves([area]);

      const expectedTree = {
        id: 1,
        areas: [
          {
            id: 'recvoGdo7z2z7pXWa',
            code: '1',
            name: '1. Information et données',
            title: 'Information et données',
            color: 'jaffa',
            competences: [
              {
                id: 'recsvLz0W2ShyfD63',
                name: 'Mener une recherche et une veille d’information',
              },
              {
                id: 'recNv8qhaY887jQb2',
                name: 'Mener une recherche et une veille d’information',
              },
            ],
          },
        ],
      };

      // when
      const competenceTree = await competenceTreeRepository.get({ locale: 'fr' });

      // then
      expect(competenceTree).to.be.an.instanceof(CompetenceTree);
      expect(competenceTree).to.deep.equal(expectedTree);
    });
  });
});
