// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Badge'.
const Badge = require('../../../../lib/domain/models/Badge');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const buildBadgeCriterion = require('./build-badge-criterion');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const buildSkillSet = require('./build-skill-set');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = function buildBadge({
  id = 1,
  altMessage = 'altMessage',
  imageUrl = '/img/banana',
  message = 'message',
  title = 'title',
  key = 'key',
  isCertifiable = false,
  targetProfileId = 456,
  badgeCriteria = [buildBadgeCriterion(), buildBadgeCriterion({ id: 2, skillSetIds: [1, 2] })],
  skillSets = [buildSkillSet(), buildSkillSet({ id: 2 })],
  isAlwaysVisible = false,
} = {}) {
  return new Badge({
    id,
    altMessage,
    imageUrl,
    message,
    title,
    key,
    isCertifiable,
    targetProfileId,
    badgeCriteria,
    skillSets,
    isAlwaysVisible,
  });
};
