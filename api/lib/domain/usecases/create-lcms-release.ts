// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'lcms'.
const lcms = require('../../infrastructure/lcms');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'cache'.
const cache = require('../../infrastructure/caches/learning-content-cache');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = async function createLcmsRelease() {
  const learningContent = await lcms.createRelease();
  cache.set(learningContent);
};
