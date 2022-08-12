// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'BadgeWithL... Remove this comment to see the full error message
const BadgeWithLearningContent = require('../../../../lib/domain/models/BadgeWithLearningContent');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const buildBadge = require('./build-badge');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'buildSkill... Remove this comment to see the full error message
const buildSkill = require('./build-skill');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const buildTube = require('./build-tube');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = function buildBadgeWithLearningContent({
  badge = buildBadge(),
  skills = [buildSkill()],
  tubes = [buildTube()],
} = {}) {
  return new BadgeWithLearningContent({ badge, skills, tubes });
};
