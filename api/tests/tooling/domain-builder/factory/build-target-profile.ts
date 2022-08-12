// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const buildSkill = require('./build-skill');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'TargetProf... Remove this comment to see the full error message
const TargetProfile = require('../../../../lib/domain/models/TargetProfile');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = function buildTargetProfile({
  id = 123,
  name = 'Profil cible super cool',
  imageUrl = 'ImageURL',
  isPublic = true,
  isSimplifiedAccess = false,
  skills = [buildSkill()],
  ownerOrganizationId = 456,
  outdated = false,
  stages = [],
  badges
}: $TSFixMe = {}) {
  return new TargetProfile({
    id,
    name,
    imageUrl,
    isPublic,
    isSimplifiedAccess,
    skills,
    ownerOrganizationId,
    outdated,
    stages,
    badges,
  });
};
