const LearningContent = require('../../../../lib/domain/models/LearningContent');
const buildSkill = require('./build-skill');
const buildTube = require('./build-tube');
const buildCompetence = require('./build-competence');
const buildArea = require('./build-area');

function buildLearningContent(areas = [buildArea()]) {
  return new LearningContent(areas);
}

buildLearningContent.withSimpleContent = () => {
  const skill = buildSkill({ id: 'skillId', tubeId: 'tubeId' });
  const tube = buildTube({ id: 'tubeId', competenceId: 'competenceId', skills: [skill] });
  const area = buildArea({ id: 'areaId' });
  const competence = buildCompetence({ id: 'competenceId', area, tubes: [tube] });
  area.competences = [competence];
  return buildLearningContent([area]);
};

module.exports = buildLearningContent;
