// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Training'.
const Training = require('../../../../lib/domain/models/Training');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = function buildTraining({
  id = 'training1',
  title = 'Training 1',
  link = 'https://example.net',
  type = 'webinar',
  duration = {
    hours: 5,
  },
  locale = 'fr-fr',
  targetProfileIds = [1],
} = {}) {
  return new Training({
    id,
    title,
    link,
    type,
    duration,
    locale,
    targetProfileIds,
  });
};
