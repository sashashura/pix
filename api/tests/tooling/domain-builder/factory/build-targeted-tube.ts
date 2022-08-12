// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'TargetedTu... Remove this comment to see the full error message
const TargetedTube = require('../../../../lib/domain/models/TargetedTube');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'buildTarge... Remove this comment to see the full error message
const buildTargetedSkill = require('./build-targeted-skill');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'buildTarge... Remove this comment to see the full error message
const buildTargetedTube = function buildTargetedTube({
  id = 'someTubeId',
  practicalTitle = 'somePracticalTitle',
  practicalDescription,
  description = 'someDescription',
  level,
  competenceId = 'someCompetenceId',
  skills = [buildTargetedSkill()],
  challenges = []
}: $TSFixMe = {}) {
  return new TargetedTube({
    id,
    practicalTitle,
    practicalDescription,
    description,
    level,
    competenceId,
    skills,
    challenges,
  });
};

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = buildTargetedTube;
