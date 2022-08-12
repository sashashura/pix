// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Stage'.
const Stage = require('../../../../lib/domain/models/Stage');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = function buildStage({
  id = 123,
  title = 'Courage',
  message = 'Insister',
  threshold = 1,
  prescriberTitle = null,
  prescriberDescription = null,
} = {}) {
  return new Stage({
    id,
    title,
    message,
    threshold,
    prescriberTitle,
    prescriberDescription,
  });
};
