// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'SkillSet'.
const SkillSet = require('../../../../lib/domain/models/SkillSet');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = function buildSkillSet({ id = 1, badgeId = 64, name = 'name', skillIds = ['recABC', 'recDEF'] } = {}) {
  return new SkillSet({
    id,
    badgeId,
    name,
    skillIds,
  });
};
