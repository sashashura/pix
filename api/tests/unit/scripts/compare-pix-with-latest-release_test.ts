// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, sinon } = require('../../test-helper');
const {
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'getUserVal... Remove this comment to see the full error message
  getUserValidatedKnowledgeElements,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'getTubeByI... Remove this comment to see the full error message
  getTubeByIds,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'getUserSki... Remove this comment to see the full error message
  getUserSkillsGroupedByTubeId,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'getHardest... Remove this comment to see the full error message
  getHardestSkillByTubeId,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'compareUse... Remove this comment to see the full error message
  compareUserScoreWithLatestRelease,
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
} = require('../../../scripts/compare-pix-with-latest-release');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'knowledgeE... Remove this comment to see the full error message
const knowledgeElementRepository = require('../../../lib/infrastructure/repositories/knowledge-element-repository');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'tubeReposi... Remove this comment to see the full error message
const tubeRepository = require('../../../lib/infrastructure/repositories/tube-repository');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'skillRepos... Remove this comment to see the full error message
const skillRepository = require('../../../lib/infrastructure/repositories/skill-repository');

// mock datas
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'KnowledgeE... Remove this comment to see the full error message
const KnowledgeElement = require('../../../lib/domain/models/KnowledgeElement');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Tube'.
const Tube = require('../../../lib/domain/models/Tube');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Skill'.
const Skill = require('../../../lib/domain/models/Skill');

const skill1 = new Skill({
  id: 'skill1',
  name: '@info1',
  tubeId: 'tube1',
  tutorialIds: [],
  pixValue: 10,
  competenceId: 'comp1',
});
const skill2 = new Skill({
  id: 'skill2',
  name: '@info2',
  tubeId: 'tube1',
  tutorialIds: [],
  pixValue: 10,
  competenceId: 'comp1',
});
const skill3 = new Skill({
  id: 'skill3',
  name: '@hack3',
  tubeId: 'tube2',
  tutorialIds: [],
  pixValue: 10,
  competenceId: 'comp1',
});

// additionnal 'active' skill which level is beyond user level
// should not be retained for calculating today score
const skill4 = new Skill({
  id: 'skill4',
  name: '@info3',
  tubeId: 'tube1',
  tutorialIds: [],
  pixValue: 10,
  competenceId: 'comp1',
});

const activeSkills = [skill1, skill2, skill3, skill4];
const skills = [skill1, skill2, skill3];

const tube1 = new Tube({ id: 'tube1', skills: [skill1, skill2] });
const tube2 = new Tube({ id: 'tube2', skills: [skill3] });
const tubes = [tube1, tube2];

const knowledge1 = new KnowledgeElement({ id: 'ke1', status: 'validated', skillId: 'skill1', earnedPix: 5 });
const knowledge2 = new KnowledgeElement({ id: 'ke2', status: 'validated', skillId: 'skill2', earnedPix: 5 });
const knowledge3 = new KnowledgeElement({ id: 'ke3', status: 'validated', skillId: 'skill3', earnedPix: 5 });

const invalidatedKe = new KnowledgeElement({ id: 'ke3', status: 'invalidated', skillId: 'skill1' });
const knowledgeElements = [knowledge1, knowledge2, invalidatedKe, knowledge3];

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Scripts | compare-pix-with-latest-release.js', function () {
  // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
  beforeEach(async function () {
    // stub repositories
    knowledgeElementRepository.findUniqByUserId = sinon.stub().resolves(knowledgeElements);
    tubeRepository.get = sinon.stub().callsFake((tubeId: $TSFixMe) => tubes.find((tube) => tube.id === tubeId));
    skillRepository.get = sinon.stub().callsFake((skillId: $TSFixMe) => skills.find((skill) => skill.id === skillId));
    skillRepository.findActiveByTubeId = sinon.stub().callsFake((tubeId: $TSFixMe) => {
      const result = activeSkills.filter((skill) => skill.tubeId === tubeId);
      return result;
    });
  });

  // @ts-expect-error TS(2304): Cannot find name 'afterEach'.
  afterEach(async function () {
    sinon.restore();
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#getUserValidatedKnowledgeElements', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return validated knowledgeElementsOnly', async function () {
      // when
      const validated = await getUserValidatedKnowledgeElements(1);

      // then
      validated.forEach((current: $TSFixMe) => {
        expect(current.status).to.equal('validated');
      });
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#getTubeByIds', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return the tube instances by their ids', async function () {
      // when
      const result = await getTubeByIds(['tube1', 'tube2']);

      // then
      expect(tubes).to.deep.equal(result);
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#getUserSkillsGroupedByTubeId', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return the skills associated to the knowledgeElements grouped by their tube ids', async function () {
      // when
      const validated = await getUserValidatedKnowledgeElements(1);
      const result = await getUserSkillsGroupedByTubeId(validated);

      // then
      expect(result).to.deep.equal({
        tube1: [skill1, skill2],
        tube2: [skill3],
      });
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#getHardestSkillByTubeId', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should keep only the hardest skill for each tube', async function () {
      // when
      const validated = await getUserValidatedKnowledgeElements(1);
      const grouped = await getUserSkillsGroupedByTubeId(validated);
      const hardest = getHardestSkillByTubeId(grouped);

      // then
      expect(hardest).to.deep.equal({
        tube1: skill2,
        tube2: skill3,
      });
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#compareUserScoreWithLatestRelease', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should be able to calculate the user score according to his knowledge elements', async function () {
      // when
      const result = await compareUserScoreWithLatestRelease(1);

      // then
      expect(result.userScore).to.equal(15);
      expect(result.todayScore).to.equal(30);
    });
  });
});
