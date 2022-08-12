// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Tube'.
const Tube = require('../models/Tube');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'computeTub... Remove this comment to see the full error message
function computeTubesFromSkills(skills: $TSFixMe) {
  const tubes: $TSFixMe = [];

  skills.forEach((skill: $TSFixMe) => {
    const tubeNameOfSkill = skill.tubeNameWithoutPrefix;
    // @ts-expect-error TS(7006): Parameter 'tube' implicitly has an 'any' type.
    const existingTube = tubes.find((tube) => tube.name === tubeNameOfSkill);
    if (existingTube) {
      existingTube.addSkill(skill);
    } else {
      tubes.push(new Tube({ skills: [skill], name: tubeNameOfSkill }));
    }
  });
  // @ts-expect-error TS(7006): Parameter 'tube' implicitly has an 'any' type.
  tubes.forEach((tube) => {
    tube.skills = _.sortBy(tube.skills, ['difficulty']);
  });

  return tubes;
}

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  computeTubesFromSkills,
};
