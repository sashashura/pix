// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'buildTarge... Remove this comment to see the full error message
const buildTargetProfile = require('./build-target-profile');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'databaseBu... Remove this comment to see the full error message
const databaseBuffer = require('../database-buffer');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = function buildTargetProfileTube({
  id = databaseBuffer.getNextId(),
  targetProfileId = buildTargetProfile().id,
  tubeId = 'tubeId1',
  level = 8,
} = {}) {
  const values = {
    id,
    targetProfileId,
    tubeId,
    level,
  };
  return databaseBuffer.pushInsertable({
    tableName: 'target-profile_tubes',
    values,
  });
};
