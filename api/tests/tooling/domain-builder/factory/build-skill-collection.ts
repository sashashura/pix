// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'buildSkill... Remove this comment to see the full error message
const buildSkill = require('./build-skill');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = function BuildSkillCollection({
  name = buildSkill.buildRandomTubeName(),
  minLevel = 3,
  maxLevel = 5,
} = {}) {
  const collection = [];

  for (let i = minLevel; i <= maxLevel; i += 1) {
    collection.push(buildSkill({ id: `rec${name}${i}`, name: `${name}${i}` }));
  }

  return collection;
};
