// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = function tutorialLearningContentDataObjectFixture({
  id = 'receomyzL0AmpMFGw',
  duration = '00:01:30',
  format = 'video',
  link = 'https://youtube.fr',
  source = 'Youtube',
  title = 'Comment dresser un panda',
  locale = 'fr-fr',
} = {}) {
  return {
    id,
    duration,
    format,
    link,
    source,
    title,
    locale,
  };
};
