// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, mockLearningContent } = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Area'.
const Area = require('../../../../lib/domain/models/Area');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'areaReposi... Remove this comment to see the full error message
const areaRepository = require('../../../../lib/infrastructure/repositories/area-repository');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Integration | Repository | area-repository', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#list', function () {
    const area0 = {
      id: 'recArea0',
      code: 'area0code',
      name: 'area0name',
      titleFrFr: 'area0titleFr',
      titleEnUs: 'area0titleEn',
      color: 'area0color',
      frameworkId: 'recFmk123',
      competenceIds: ['recCompetence0'],
    };
    const area1 = {
      id: 'recArea1',
      code: 'area1code',
      name: 'area1name',
      titleFrFr: 'area1titleFr',
      titleEnUs: 'area1titleEn',
      color: 'area1color',
      frameworkId: 'recFmk456',
      competenceIds: [],
    };

    const learningContent = { areas: [area0, area1] };

    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(function () {
      mockLearningContent(learningContent);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return all areas without fetching competences', async function () {
      // when
      const areas = await areaRepository.list();

      // then
      expect(areas).to.have.lengthOf(2);
      expect(areas[0]).to.be.instanceof(Area);
      expect(areas).to.deep.include.members([
        {
          id: area0.id,
          code: area0.code,
          name: area0.name,
          title: area0.titleFrFr,
          color: area0.color,
          frameworkId: area0.frameworkId,
          competences: [],
        },
        {
          id: area1.id,
          code: area1.code,
          name: area1.name,
          title: area1.titleFrFr,
          color: area1.color,
          frameworkId: area1.frameworkId,
          competences: [],
        },
      ]);
    });

    // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
    describe('when locale is "en"', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return all areas with english title', async function () {
        // given
        const locale = 'en';
        // when
        const areas = await areaRepository.list({ locale });

        // then
        expect(areas[0].title).to.equal(area0.titleEnUs);
        expect(areas[1].title).to.equal(area1.titleEnUs);
      });
    });

    // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
    describe('when locale is not "en"', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return all areas with french title', async function () {
        // given
        const locale = 'fr';

        // when
        const areas = await areaRepository.list({ locale });

        // then
        expect(areas[0].title).to.equal(area0.titleFrFr);
        expect(areas[1].title).to.equal(area1.titleFrFr);
      });
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#listWithPixCompetencesOnly', function () {
    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when there are areas that do not have pix competences', function () {
      const learningContent = {
        areas: [
          {
            id: 'recArea0',
            code: 'area0code',
            name: 'area0name',
            titleFrFr: 'area0titleFr',
            titleEnUs: 'area0titleEn',
            color: 'area0color',
            frameworkId: 'recFmk123',
            competenceIds: ['recCompetence0'],
          },
        ],
        competences: [{ id: 'recCompetence0', origin: 'NotPix' }],
      };

      // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
      beforeEach(function () {
        mockLearningContent(learningContent);
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should ignore the area', async function () {
        // when
        const areas = await areaRepository.listWithPixCompetencesOnly();

        // then
        expect(areas).to.be.empty;
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when there are areas that have pix competences', function () {
      const area0 = {
        id: 'recArea0',
        code: 'area0code',
        name: 'area0name',
        titleFrFr: 'area0titleFr',
        titleEnUs: 'area0titleEn',
        color: 'area0color',
        frameworkId: 'recFmk123',
        competenceIds: ['recCompetence0', 'recCompetence1'],
      };

      const area1 = {
        id: 'recArea1',
        code: 'area1code',
        name: 'area1name',
        titleFrFr: 'area1titleFr',
        titleEnUs: 'area1titleEn',
        color: 'area1color',
        frameworkId: 'recFmk456',
        competenceIds: ['recCompetence2', 'recCompetence3'],
      };

      const learningContent = {
        areas: [area0, area1],
        competences: [
          { id: 'recCompetence0', origin: 'NotPix', areaId: 'recArea0' },
          { id: 'recCompetence1', origin: 'Pix', areaId: 'recArea0' },
          { id: 'recCompetence2', origin: 'NotPix', areaId: 'recArea1' },
          { id: 'recCompetence3', origin: 'Pix', areaId: 'recArea1' },
        ],
      };

      // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
      beforeEach(function () {
        mockLearningContent(learningContent);
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return the areas with only pix competences in it', async function () {
        // when
        const areas = await areaRepository.listWithPixCompetencesOnly();

        // then
        expect(areas).to.have.lengthOf(2);
        expect(areas[0]).to.be.instanceof(Area);
        expect(_.omit(areas[0], 'competences')).to.deep.equal({
          id: area0.id,
          code: area0.code,
          name: area0.name,
          title: area0.titleFrFr,
          color: area0.color,
          frameworkId: area0.frameworkId,
        });
        expect(areas[0].competences).to.have.lengthOf(1);
        expect(areas[0].competences[0].id).to.equal('recCompetence1');
        expect(_.omit(areas[1], 'competences')).to.deep.equal({
          id: area1.id,
          code: area1.code,
          name: area1.name,
          title: area1.titleFrFr,
          color: area1.color,
          frameworkId: area1.frameworkId,
        });
        expect(areas[1].competences).to.have.lengthOf(1);
        expect(areas[1].competences[0].id).to.equal('recCompetence3');
      });
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#findByFrameworkIdWithCompetences', function () {
    const area0 = {
      id: 'recArea0',
      code: 'area0code',
      name: 'area0name',
      titleFrFr: 'area0titleFr',
      titleEnUs: 'area0titleEn',
      color: 'area0color',
      frameworkId: 'framework1',
      competenceIds: ['recCompetence0', 'recCompetence1'],
    };

    const area1 = {
      id: 'recArea1',
      code: 'area1code',
      name: 'area1name',
      titleFrFr: 'area1titleFr',
      titleEnUs: 'area1titleEn',
      color: 'area1color',
      frameworkId: 'framework2',
      competenceIds: ['recCompetence2', 'recCompetence3'],
    };

    const learningContent = {
      areas: [area0, area1],
      competences: [
        {
          id: 'recCompetence0',
          areaId: 'recArea0',
          nameFrFr: 'competence0NameFr',
          nameEnUs: 'competence0NameEn',
          descriptionFrFr: 'competence0DescriptionFr',
          descriptionEnUs: 'competence0DescriptionEn',
        },
        {
          id: 'recCompetence1',
          areaId: 'recArea0',
          nameFrFr: 'competence1NameFr',
          nameEnUs: 'competence1NameEn',
          descriptionFrFr: 'competence1DescriptionFr',
          descriptionEnUs: 'competence1DescriptionEn',
        },
        {
          id: 'recCompetence2',
          areaId: 'recArea1',
          nameFrFr: 'competence2NameFr',
          nameEnUs: 'competence2NameEn',
          descriptionFrFr: 'competence2DescriptionFr',
          descriptionEnUs: 'competence2DescriptionEn',
        },
        {
          id: 'recCompetence3',
          areaId: 'recArea1',
          nameFrFr: 'competence3NameFr',
          nameEnUs: 'competence3NameEn',
          descriptionFrFr: 'competence3DescriptionFr',
          descriptionEnUs: 'competence3DescriptionEn',
        },
      ],
    };
    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(function () {
      mockLearningContent(learningContent);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return a list of areas from the proper framework', async function () {
      // when
      const areas = await areaRepository.findByFrameworkIdWithCompetences({ frameworkId: 'framework1' });

      // then
      expect(areas).to.have.lengthOf(1);
      expect(areas[0]).to.be.instanceof(Area);
      expect(_.omit(areas[0], 'competences')).to.deep.equal({
        id: area0.id,
        code: area0.code,
        name: area0.name,
        title: area0.titleFrFr,
        color: area0.color,
        frameworkId: area0.frameworkId,
      });
      expect(areas[0].competences).to.have.lengthOf(2);
      expect(areas[0].competences[0].id).to.equal('recCompetence0');
      expect(areas[0].competences[0].name).to.equal('competence0NameFr');
      expect(areas[0].competences[0].description).to.equal('competence0DescriptionFr');
      expect(areas[0].competences[1].id).to.equal('recCompetence1');
      expect(areas[0].competences[1].name).to.equal('competence1NameFr');
      expect(areas[0].competences[1].description).to.equal('competence1DescriptionFr');
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return a list of areas in english', async function () {
      // when
      const areas = await areaRepository.findByFrameworkIdWithCompetences({ frameworkId: 'framework1', locale: 'en' });

      // then
      expect(areas).to.have.lengthOf(1);
      expect(areas[0]).to.be.instanceof(Area);
      expect(_.omit(areas[0], 'competences')).to.deep.equal({
        id: area0.id,
        code: area0.code,
        name: area0.name,
        title: area0.titleEnUs,
        color: area0.color,
        frameworkId: area0.frameworkId,
      });
      expect(areas[0].competences).to.have.lengthOf(2);
      expect(areas[0].competences[0].id).to.equal('recCompetence0');
      expect(areas[0].competences[0].name).to.equal('competence0NameEn');
      expect(areas[0].competences[0].description).to.equal('competence0DescriptionEn');
      expect(areas[0].competences[1].id).to.equal('recCompetence1');
      expect(areas[0].competences[1].name).to.equal('competence1NameEn');
      expect(areas[0].competences[1].description).to.equal('competence1DescriptionEn');
    });
  });
});
