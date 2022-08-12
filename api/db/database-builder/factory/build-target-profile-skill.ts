// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'buildTarge... Remove this comment to see the full error message
const buildTargetProfile = require('./build-target-profile');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'databaseBu... Remove this comment to see the full error message
const databaseBuffer = require('../database-buffer');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = function buildTargetProfileSkill({
  id = databaseBuffer.getNextId(),
  targetProfileId,
  skillId = 'recSKI456'
}: $TSFixMe = {}) {
  targetProfileId = _.isUndefined(targetProfileId) ? buildTargetProfile().id : targetProfileId;

  const values = {
    id,
    targetProfileId,
    skillId,
  };
  return databaseBuffer.pushInsertable({
    tableName: 'target-profiles_skills',
    values,
  });
};
