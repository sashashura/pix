// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Tube'.
const Tube = require('../../../../lib/domain/models/Tube');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'buildSkill... Remove this comment to see the full error message
const buildSkillCollection = require('./build-skill-collection');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = function buildTube({
  id = 'recTube123',
  name = '@tubeName',
  title = 'titre',
  description = 'description',
  practicalTitle = 'titre pratique',
  practicalDescription = 'description pratique',
  skills = buildSkillCollection(),
  competenceId = 'recCOMP123',
} = {}) {
  return new Tube({
    id,
    name,
    title,
    description,
    practicalTitle,
    practicalDescription,
    skills,
    competenceId,
  });
};
