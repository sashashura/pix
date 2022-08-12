// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'TargetedSk... Remove this comment to see the full error message
const TargetedSkill = require('../../../../lib/domain/models/TargetedSkill');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'buildTarge... Remove this comment to see the full error message
const buildTargetedSkill = function buildTargetedSkill({
  id = 'someSkillId',
  name = 'someSkillName5',
  tubeId = 'someTubeId',
  tutorialIds = [],
} = {}) {
  return new TargetedSkill({
    id,
    name,
    tubeId,
    tutorialIds,
  });
};

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = buildTargetedSkill;
