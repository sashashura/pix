// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'PlacementP... Remove this comment to see the full error message
const PlacementProfile = require('../../../../lib/domain/models/PlacementProfile');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const buildUserCompetence = require('./build-user-competence');

const buildPlacementProfile = function buildPlacementProfile({
  profileDate = new Date('2020-01-01'),
  userId = 123,
  userCompetences = [buildUserCompetence()],
} = {}) {
  return new PlacementProfile({
    profileDate,
    userId,
    userCompetences,
  });
};

buildPlacementProfile.buildForCompetences = function buildForCompetences({
  profileDate,
  userId,

  // [{competence, level, score}, ...]
  competencesData
}: $TSFixMe) {
  const userCompetences = _.map(competencesData, (competenceData: $TSFixMe) => {
    return buildUserCompetence({
      id: competenceData.id,
      index: competenceData.index,
      name: competenceData.name,
      pixScore: competenceData.score,
      estimatedLevel: competenceData.level,
    });
  });

  return buildPlacementProfile({
    profileDate,
    userId,
    userCompetences,
  });
};

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = buildPlacementProfile;
