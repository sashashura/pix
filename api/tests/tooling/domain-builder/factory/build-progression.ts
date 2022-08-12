// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'buildSkill... Remove this comment to see the full error message
const buildSkillCollection = require('./build-skill-collection');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const buildKnowledgeElement = require('./build-knowledge-element');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Progressio... Remove this comment to see the full error message
const Progression = require('../../../../lib/domain/models/Progression');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = function buildProgression({
  id = Progression.generateIdFromAssessmentId(1234),
  targetedSkills = buildSkillCollection(),
  knowledgeElements = [buildKnowledgeElement()],
  isProfileCompleted = true,
} = {}) {
  return new Progression({ id, targetedSkills, knowledgeElements, isProfileCompleted });
};
