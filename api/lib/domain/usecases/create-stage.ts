// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'stageValid... Remove this comment to see the full error message
const stageValidator = require('../validators/stage-validator');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = function createStage({
  stage,
  stageRepository
}: $TSFixMe) {
  stageValidator.validate({ stage });

  return stageRepository.create(stage);
};
