// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'UserCompet... Remove this comment to see the full error message
const UserCompetence = require('../../../../lib/domain/models/UserCompetence');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'buildArea'... Remove this comment to see the full error message
const buildArea = require('./build-area');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = function buildUserCompetence({
  id = 'recUserComp',
  index = '1.1',
  name = 'name',
  area = buildArea(),
  pixScore = 42,
  estimatedLevel = 1,
  skills = [],
} = {}) {
  return new UserCompetence({
    id,
    index,
    name,
    area,
    pixScore,
    estimatedLevel,
    skills,
  });
};
