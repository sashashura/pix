// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');

function progress(campaignParticipationCompleted: $TSFixMe, numberOfKnowledgeElements: $TSFixMe, numberOfSkillsInTargetProfile: $TSFixMe) {
  if (campaignParticipationCompleted) {
    return 1;
  }
  return _.round(numberOfKnowledgeElements / numberOfSkillsInTargetProfile, 3);
}

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  progress,
};
