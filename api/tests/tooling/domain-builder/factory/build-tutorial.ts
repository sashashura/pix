// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Tutorial'.
const Tutorial = require('../../../../lib/domain/models/Tutorial');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = function buildTutorial({
  id = 'recTuto1',
  duration = '00:01:30',
  format = 'video',
  link = 'https://youtube.fr',
  source = 'Youtube',
  title = 'Savoir regarder des vidéos youtube.',
} = {}) {
  return new Tutorial({
    id,
    duration,
    format,
    link,
    source,
    title,
  });
};
