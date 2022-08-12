// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, mockLearningContent } = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Tube'.
const Tube = require('../../../../lib/domain/models/Tube');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'tubeReposi... Remove this comment to see the full error message
const tubeRepository = require('../../../../lib/infrastructure/repositories/tube-repository');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Integration | Repository | tube-repository', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#get', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return the tube', async function () {
      // given
      const expectedTube = new Tube({
        id: 'recTube0',
        name: 'tubeName',
        title: 'tubeTitle',
        description: 'tubeDescription',
        practicalTitle: 'translatedPracticalTitle',
        practicalDescription: 'translatedPracticalDescription',
        competenceId: 'recCompetence0',
      });
      const learningContent = {
        tubes: [
          {
            id: 'recTube0',
            name: 'tubeName',
            title: 'tubeTitle',
            description: 'tubeDescription',
            practicalTitleFrFr: 'translatedPracticalTitle',
            practicalDescriptionFrFr: 'translatedPracticalDescription',
            competenceId: 'recCompetence0',
          },
        ],
      };
      mockLearningContent(learningContent);

      // when
      const tube = await tubeRepository.get(expectedTube.id);

      // then
      expect(tube).to.be.instanceof(Tube);
      expect(tube).to.deep.equal(expectedTube);
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#list', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return the tubes', async function () {
      // given
      const tube0 = new Tube({
        id: 'recTube0',
        name: 'tubeName0',
        title: 'tubeTitle0',
        description: 'tubeDescription0',
        practicalTitle: 'translatedPracticalTitle0',
        practicalDescription: 'translatedPracticalDescription0',
        competenceId: 'recCompetence0',
      });
      const tube1 = new Tube({
        id: 'recTube1',
        name: 'tubeName1',
        title: 'tubeTitle1',
        description: 'tubeDescription1',
        practicalTitle: 'translatedPracticalTitle1',
        practicalDescription: 'translatedPracticalDescription1',
        competenceId: 'recCompetence1',
      });
      const learningContentTube0 = {
        id: 'recTube0',
        name: 'tubeName0',
        title: 'tubeTitle0',
        description: 'tubeDescription0',
        practicalTitleFrFr: 'translatedPracticalTitle0',
        practicalDescriptionFrFr: 'translatedPracticalDescription0',
        competenceId: 'recCompetence0',
      };

      const learningContentTube1 = {
        id: 'recTube1',
        name: 'tubeName1',
        title: 'tubeTitle1',
        description: 'tubeDescription1',
        practicalTitleFrFr: 'translatedPracticalTitle1',
        practicalDescriptionFrFr: 'translatedPracticalDescription1',
        competenceId: 'recCompetence1',
      };
      mockLearningContent({ tubes: [learningContentTube0, learningContentTube1] });

      // when
      const tubes = await tubeRepository.list();

      // then
      expect(tubes).to.have.length(2);
      expect(tubes[0]).to.deep.equal(tube0);
      expect(tubes[1]).to.deep.equal(tube1);
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#findByNames', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return the tubes ordered by name', async function () {
      // given
      const tube0 = new Tube({
        id: 'recTube0',
        name: 'tubeName0',
        title: 'tubeTitle0',
        description: 'tubeDescription0',
        practicalTitle: 'translatedPracticalTitle0',
        practicalDescription: 'translatedPracticalDescription0',
        competenceId: 'recCompetence0',
      });

      const tube1 = new Tube({
        id: 'recTube1',
        name: 'tubeName1',
        title: 'tubeTitle1',
        description: 'tubeDescription1',
        practicalTitle: 'translatedPracticalTitle1',
        practicalDescription: 'translatedPracticalDescription1',
        competenceId: 'recCompetence1',
      });

      const learningContentTube0 = {
        id: 'recTube0',
        name: 'tubeName0',
        title: 'tubeTitle0',
        description: 'tubeDescription0',
        practicalTitleFrFr: 'translatedPracticalTitle0',
        practicalDescriptionFrFr: 'translatedPracticalDescription0',
        competenceId: 'recCompetence0',
      };

      const learningContentTube1 = {
        id: 'recTube1',
        name: 'tubeName1',
        title: 'tubeTitle1',
        description: 'tubeDescription1',
        practicalTitleFrFr: 'translatedPracticalTitle1',
        practicalDescriptionFrFr: 'translatedPracticalDescription1',
        competenceId: 'recCompetence1',
      };
      mockLearningContent({ tubes: [learningContentTube1, learningContentTube0] });

      // when
      const tubes = await tubeRepository.findByNames({ tubeNames: ['tubeName1', 'tubeName0'] });

      // then
      expect(tubes[0]).to.deep.equal(tube0);
      expect(tubes[1]).to.deep.equal(tube1);
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when no locale is provided (using default locale)', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return the tubes with default locale translation', async function () {
        // given
        const expectedTube = new Tube({
          id: 'recTube0',
          name: 'tubeName',
          title: 'tubeTitle',
          description: 'tubeDescription',
          practicalTitle: 'translatedPracticalTitle',
          practicalDescription: 'translatedPracticalDescription',
          competenceId: 'recCompetence0',
        });
        const learningContent = {
          tubes: [
            {
              id: 'recTube0',
              name: 'tubeName',
              title: 'tubeTitle',
              description: 'tubeDescription',
              practicalTitleFrFr: 'translatedPracticalTitle',
              practicalDescriptionFrFr: 'translatedPracticalDescription',
              competenceId: 'recCompetence0',
            },
          ],
        };
        mockLearningContent(learningContent);

        // when
        const tubes = await tubeRepository.findByNames({ tubeNames: ['tubeName'] });

        // then
        expect(tubes[0].practicalTitle).to.equal(expectedTube.practicalTitle);
        expect(tubes[0].practicalDescription).to.equal(expectedTube.practicalDescription);
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when specifying a locale', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return the tubes with appropriate translation', async function () {
        // given
        const expectedTube = new Tube({
          id: 'recTube0',
          name: 'tubeName',
          title: 'tubeTitle',
          description: 'tubeDescription',
          practicalTitle: 'translatedPracticalTitleEnUs',
          practicalDescription: 'translatedPracticalDescriptionEnUs',
          competenceId: 'recCompetence0',
        });
        const learningContent = {
          tubes: [
            {
              id: 'recTube0',
              name: 'tubeName',
              title: 'tubeTitle',
              description: 'tubeDescription',
              practicalTitleFrFr: 'translatedPracticalTitle',
              practicalTitleEnUs: 'translatedPracticalTitleEnUs',
              practicalDescriptionFrFr: 'translatedPracticalDescription',
              practicalDescriptionEnUs: 'translatedPracticalDescriptionEnUs',
              competenceId: 'recCompetence0',
            },
          ],
        };
        mockLearningContent(learningContent);
        const locale = 'en';

        // when
        const tubes = await tubeRepository.findByNames({ tubeNames: 'tubeName', locale });

        // then
        expect(tubes[0].practicalTitle).to.equal(expectedTube.practicalTitle);
        expect(tubes[0].practicalDescription).to.equal(expectedTube.practicalDescription);
      });
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#findActiveByRecordIds', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return a list of active tubes', async function () {
      // given
      const tube1 = new Tube({
        id: 'recTube1',
        name: 'tubeName1',
        title: 'tubeTitle1',
        description: 'tubeDescription1',
        practicalTitle: 'translatedPracticalTitle1',
        practicalDescription: 'translatedPracticalDescription1',
        competenceId: 'recCompetence1',
      });

      const learningContentTube0 = {
        id: 'recTube0',
        name: 'tubeName0',
        title: 'tubeTitle0',
        description: 'tubeDescription0',
        practicalTitleFrFr: 'translatedPracticalTitle0',
        practicalDescriptionFrFr: 'translatedPracticalDescription0',
        competenceId: 'recCompetence0',
      };

      const learningContentTube1 = {
        id: 'recTube1',
        name: 'tubeName1',
        title: 'tubeTitle1',
        description: 'tubeDescription1',
        practicalTitleFrFr: 'translatedPracticalTitle1',
        practicalDescriptionFrFr: 'translatedPracticalDescription1',
        competenceId: 'recCompetence1',
      };

      const learningContentTube2 = {
        id: 'recTube2',
        name: 'tubeName2',
        title: 'tubeTitle2',
        description: 'tubeDescription2',
        practicalTitleFrFr: 'translatedPracticalTitle2',
        practicalDescriptionFrFr: 'translatedPracticalDescription2',
        competenceId: 'recCompetence2',
      };

      const skills = [
        {
          id: 'skillId0',
          status: 'actif',
          tubeId: 'recTube0',
        },
        {
          id: 'skillId1',
          status: 'actif',
          tubeId: 'recTube1',
        },
        {
          id: 'skillId2',
          status: 'archivé',
          tubeId: 'recTube2',
        },
      ];
      mockLearningContent({ tubes: [learningContentTube1, learningContentTube0, learningContentTube2], skills });

      // when
      const tubes = await tubeRepository.findActiveByRecordIds(['recTube1', 'recTube2']);

      // then
      expect(tubes).to.have.lengthOf(1);
      expect(tubes[0]).to.deep.equal(tube1);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return a list of english active tubes', async function () {
      // given
      const tube1 = new Tube({
        id: 'recTube1',
        name: 'tubeName1',
        title: 'tubeTitle1',
        description: 'tubeDescription1',
        practicalTitle: 'translatedPracticalTitle1EnUs',
        practicalDescription: 'translatedPracticalDescription1EnUs',
        competenceId: 'recCompetence1',
      });

      const learningContentTube0 = {
        id: 'recTube0',
        name: 'tubeName0',
        title: 'tubeTitle0',
        description: 'tubeDescription0',
        practicalTitleFrFr: 'translatedPracticalTitle0',
        practicalDescriptionFrFr: 'translatedPracticalDescription0',
        practicalTitleEnUs: 'translatedPracticalTitle0EnUs',
        practicalDescriptionEnUs: 'translatedPracticalDescription0EnUs',
        competenceId: 'recCompetence0',
      };

      const learningContentTube1 = {
        id: 'recTube1',
        name: 'tubeName1',
        title: 'tubeTitle1',
        description: 'tubeDescription1',
        practicalTitleFrFr: 'translatedPracticalTitle1',
        practicalDescriptionFrFr: 'translatedPracticalDescription1',
        practicalTitleEnUs: 'translatedPracticalTitle1EnUs',
        practicalDescriptionEnUs: 'translatedPracticalDescription1EnUs',
        competenceId: 'recCompetence1',
      };

      const learningContentTube2 = {
        id: 'recTube2',
        name: 'tubeName2',
        title: 'tubeTitle2',
        description: 'tubeDescription2',
        practicalTitleFrFr: 'translatedPracticalTitle2',
        practicalDescriptionFrFr: 'translatedPracticalDescription2',
        practicalTitleEnUs: 'translatedPracticalTitle2EnUs',
        practicalDescriptionEnUs: 'translatedPracticalDescription2EnUs',
        competenceId: 'recCompetence2',
      };

      const skills = [
        {
          id: 'skillId0',
          status: 'actif',
          tubeId: 'recTube0',
        },
        {
          id: 'skillId1',
          status: 'actif',
          tubeId: 'recTube1',
        },
        {
          id: 'skillId2',
          status: 'archivé',
          tubeId: 'recTube2',
        },
      ];
      mockLearningContent({ tubes: [learningContentTube1, learningContentTube0, learningContentTube2], skills });

      // when
      const tubes = await tubeRepository.findActiveByRecordIds(['recTube1', 'recTube2'], 'en');

      // then
      expect(tubes).to.have.lengthOf(1);
      expect(tubes[0]).to.deep.equal(tube1);
    });
  });
});
