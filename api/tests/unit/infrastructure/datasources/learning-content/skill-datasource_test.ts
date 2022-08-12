// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, sinon } = require('../../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'skillDatas... Remove this comment to see the full error message
const skillDatasource = require('../../../../../lib/infrastructure/datasources/learning-content/skill-datasource');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'lcms'.
const lcms = require('../../../../../lib/infrastructure/lcms');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'cache'.
const cache = require('../../../../../lib/infrastructure/caches/learning-content-cache');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Infrastructure | Datasource | LearningContent | SkillDatasource', function () {
  // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
  beforeEach(function () {
    sinon.stub(cache, 'get').callsFake((generator: $TSFixMe) => generator());
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#findOperativeByRecordIds', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return an array of skill data objects', async function () {
      // given
      const rawSkill1 = { id: 'recSkill1', status: 'actif' };
      const rawSkill2 = { id: 'recSkill2', status: 'archivé' };
      const rawSkill3 = { id: 'recSkill3', status: 'actif' };
      const rawSkill4 = { id: 'recSkill4', status: 'périmé' };

      const records = [rawSkill1, rawSkill2, rawSkill3, rawSkill4];
      sinon.stub(lcms, 'getLatestRelease').resolves({ skills: records });

      // when
      const foundSkills = await skillDatasource.findOperativeByRecordIds([rawSkill1.id, rawSkill2.id, rawSkill4.id]);

      // then
      expect(foundSkills).to.be.an('array');
      expect(_.map(foundSkills, 'id')).to.deep.equal([rawSkill1.id, rawSkill2.id]);
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#findByRecordIds', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return an array of skill data objects', async function () {
      // given
      const rawSkill1 = { id: 'recSkill1', status: 'actif' };
      const rawSkill2 = { id: 'recSkill2', status: 'archivé' };
      const rawSkill3 = { id: 'recSkill3', status: 'actif' };
      const rawSkill4 = { id: 'recSkill4', status: 'périmé' };

      const records = [rawSkill1, rawSkill2, rawSkill3, rawSkill4];
      sinon.stub(lcms, 'getLatestRelease').resolves({ skills: records });

      // when
      const foundSkills = await skillDatasource.findByRecordIds([rawSkill1.id, rawSkill2.id, rawSkill4.id]);

      // then
      expect(foundSkills).to.be.an('array');
      expect(_.map(foundSkills, 'id')).to.deep.equal([rawSkill1.id, rawSkill2.id, rawSkill4.id]);
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#findActive', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should query LCMS skills', async function () {
      // given
      sinon.stub(lcms, 'getLatestRelease').resolves({ skills: [] });

      // when
      await skillDatasource.findActive();

      // then
      expect(lcms.getLatestRelease).to.have.been.called;
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should resolve an array of Skills from LCMS', async function () {
      // given
      const rawSkill1 = { id: 'recSkill1', status: 'actif' },
        rawSkill2 = { id: 'recSkill2', status: 'actif' };
      sinon.stub(lcms, 'getLatestRelease').resolves({ skills: [rawSkill1, rawSkill2] });

      // when
      const foundSkills = await skillDatasource.findActive();

      // then
      expect(_.map(foundSkills, 'id')).to.deep.equal([rawSkill1.id, rawSkill2.id]);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should resolve an array of Skills with only activated Skillfrom learning content', async function () {
      // given
      const rawSkill1 = { id: 'recSkill1', status: 'actif' },
        rawSkill2 = { id: 'recSkill2', status: 'actif' },
        rawSkill3 = { id: 'recSkill3', status: 'périmé' };
      sinon.stub(lcms, 'getLatestRelease').resolves({ skills: [rawSkill1, rawSkill2, rawSkill3] });

      // when
      const foundSkills = await skillDatasource.findActive();

      // then
      expect(_.map(foundSkills, 'id')).to.deep.equal([rawSkill1.id, rawSkill2.id]);
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#findOperative', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should query LCMS skills', async function () {
      // given
      sinon.stub(lcms, 'getLatestRelease').resolves({ skills: [] });

      // when
      await skillDatasource.findOperative();

      // then
      expect(lcms.getLatestRelease).to.have.been.called;
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should resolve an array of Skills from learning content', async function () {
      // given
      const rawSkill1 = { id: 'recSkill1', status: 'actif' },
        rawSkill2 = { id: 'recSkill2', status: 'actif' };
      sinon.stub(lcms, 'getLatestRelease').resolves({ skills: [rawSkill1, rawSkill2] });

      // when
      const foundSkills = await skillDatasource.findOperative();

      // then
      expect(_.map(foundSkills, 'id')).to.deep.equal([rawSkill1.id, rawSkill2.id]);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should resolve an array of Skills with only activated Skillfrom learning content', async function () {
      // given
      const rawSkill1 = { id: 'recSkill1', status: 'actif' },
        rawSkill2 = { id: 'recSkill2', status: 'archivé' },
        rawSkill3 = { id: 'recSkill3', status: 'périmé' };
      sinon.stub(lcms, 'getLatestRelease').resolves({ skills: [rawSkill1, rawSkill2, rawSkill3] });

      // when
      const foundSkills = await skillDatasource.findOperative();

      // then
      expect(_.map(foundSkills, 'id')).to.deep.equal([rawSkill1.id, rawSkill2.id]);
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#findActiveByCompetenceId', function () {
    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(function () {
      const acquix1 = { id: 'recSkill1', status: 'actif', competenceId: 'recCompetence' };
      const acquix2 = { id: 'recSkill2', status: 'actif', competenceId: 'recCompetence' };
      const acquix3 = { id: 'recSkill3', status: 'périmé', competenceId: 'recCompetence' };
      const acquix4 = { id: 'recSkill4', status: 'actif', competenceId: 'recOtherCompetence' };
      sinon.stub(lcms, 'getLatestRelease').resolves({ skills: [acquix1, acquix2, acquix3, acquix4] });
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should retrieve all skills from learning content for one competence', async function () {
      // when
      const skills = await skillDatasource.findActiveByCompetenceId('recCompetence');

      // then
      expect(_.map(skills, 'id')).to.have.members(['recSkill1', 'recSkill2']);
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#findActiveByTubeId', function () {
    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(function () {
      const acquix1 = { id: 'recSkill1', status: 'actif', competenceId: 'recCompetence', tubeId: 'recTube' };
      const acquix2 = { id: 'recSkill2', status: 'actif', competenceId: 'recCompetence', tubeId: 'recTube' };
      const acquix3 = { id: 'recSkill3', status: 'périmé', competenceId: 'recCompetence', tubeId: 'recTube' };
      const acquix4 = { id: 'recSkill4', status: 'actif', competenceId: 'recOtherCompetence', tubeId: 'recOtherTube' };
      sinon.stub(lcms, 'getLatestRelease').resolves({ skills: [acquix1, acquix2, acquix3, acquix4] });
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should retrieve all skills from learning content for one competence', async function () {
      // when
      const skills = await skillDatasource.findActiveByTubeId('recTube');

      // then
      expect(_.map(skills, 'id')).to.have.members(['recSkill1', 'recSkill2']);
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#findOperativeByCompetenceId', function () {
    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(function () {
      const acquix1 = { id: 'recSkill1', status: 'actif', competenceId: 'recCompetence' };
      const acquix2 = { id: 'recSkill2', status: 'archivé', competenceId: 'recCompetence' };
      const acquix3 = { id: 'recSkill3', status: 'périmé', competenceId: 'recCompetence' };
      const acquix4 = { id: 'recSkill4', status: 'actif', competenceId: 'recOtherCompetence' };
      sinon.stub(lcms, 'getLatestRelease').resolves({ skills: [acquix1, acquix2, acquix3, acquix4] });
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should retrieve all skills from learning content for one competence', async function () {
      // when
      const skills = await skillDatasource.findOperativeByCompetenceId('recCompetence');

      // then
      expect(_.map(skills, 'id')).to.have.members(['recSkill1', 'recSkill2']);
    });
  });
});
