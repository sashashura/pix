// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, mockLearningContent, domainBuilder } = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'thematicRe... Remove this comment to see the full error message
const thematicRepository = require('../../../../lib/infrastructure/repositories/thematic-repository');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Thematic'.
const Thematic = require('../../../../lib/domain/models/Thematic');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Integration | Repository | thematic-repository', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#list', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return thematics', async function () {
      // given
      const thematic = domainBuilder.buildThematic({ id: 'recThematic1' });

      const learningContent = {
        thematics: [thematic],
      };

      mockLearningContent(learningContent);

      // when
      const actualThematics = await thematicRepository.list();

      // then
      expect(actualThematics).to.deepEqualArray([thematic]);
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#findByCompetenceId', function () {
    const competenceId = 'competence0';

    // given
    const thematic0 = {
      id: 'recThematic0',
      name: 'thematic0',
      nameEnUs: 'thematic0EnUs',
      index: 1,
      tubeIds: ['recTube0'],
      competenceId,
    };

    const thematic1 = {
      id: 'recThematic1',
      name: 'thematic1',
      nameEnUs: 'thematic1EnUs',
      index: 1,
      tubeIds: ['recTube1'],
      competenceId,
    };

    const thematics = [
      thematic0,
      thematic1,
      {
        id: 'recThematic2',
        name: 'thematic2',
        nameEnUs: 'thematic2EnUs',
        index: 1,
        tubeIds: ['recTube2'],
        competenceId: 'competence1',
      },
    ];

    const learningContent = {
      thematics,
    };

    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(function () {
      mockLearningContent(learningContent);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return thematics of a competence', async function () {
      // when
      const foundThematics = await thematicRepository.findByCompetenceIds([competenceId]);

      // then
      expect(foundThematics).to.have.lengthOf(2);
      expect(foundThematics[0]).to.deep.equal({
        id: 'recThematic0',
        name: 'thematic0',
        index: 1,
        tubeIds: ['recTube0'],
      });
      expect(foundThematics[0]).to.be.instanceOf(Thematic);
      expect(foundThematics[1]).to.deep.equal({
        id: 'recThematic1',
        name: 'thematic1',
        index: 1,
        tubeIds: ['recTube1'],
      });
      expect(foundThematics[1]).to.be.instanceOf(Thematic);
    });

    // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
    describe('When locale is en', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return the translated name in english', async function () {
        const locale = 'en';
        // when
        const foundThematics = await thematicRepository.findByCompetenceIds([competenceId], locale);

        // then
        expect(foundThematics).to.have.lengthOf(2);
        expect(foundThematics[0]).to.deep.equal({
          id: 'recThematic0',
          name: 'thematic0EnUs',
          index: 1,
          tubeIds: ['recTube0'],
        });
        expect(foundThematics[0]).to.be.instanceOf(Thematic);
        expect(foundThematics[1]).to.deep.equal({
          id: 'recThematic1',
          name: 'thematic1EnUs',
          index: 1,
          tubeIds: ['recTube1'],
        });
        expect(foundThematics[1]).to.be.instanceOf(Thematic);
      });
    });
  });
});
