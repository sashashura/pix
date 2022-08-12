// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Skill'.
const Skill = require('../../../../lib/domain/models/Skill');

const buildSkill = function buildSkill({
  id = 'recSK123',
  name = '@sau6',
  pixValue = 3,
  competenceId = 'recCOMP123',
  tutorialIds = [],
  learningMoreTutorialIds = [],
  tubeId = 'recTUB123',
  version = 1,
  level = 1,
} = {}) {
  return new Skill({
    id,
    name,
    pixValue,
    competenceId,
    tutorialIds,
    learningMoreTutorialIds,
    tubeId,
    version,
    level,
  });
};

buildSkill.buildRandomTubeName = buildRandomTubeName;
// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = buildSkill;

/**
 * A tube name starts by a @ and contains between 3 and 15 other letters
 * @returns {generatedRandomTubeName}
 */
function buildRandomTubeName() {
  const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  const MAX_TUBE_NAME_LENGHT = 15;
  const MIN_TUBE_NAME_LENGHT = 3;

  function getRandomInt(min: $TSFixMe, max: $TSFixMe) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
  }

  let generatedTubeName = '@';
  const tubeNameLength = getRandomInt(MIN_TUBE_NAME_LENGHT, MAX_TUBE_NAME_LENGHT);

  for (let index = 0; index < tubeNameLength; index++) {
    generatedTubeName += LETTERS.charAt(Math.floor(Math.random() * LETTERS.length));
  }

  return generatedTubeName;
}
