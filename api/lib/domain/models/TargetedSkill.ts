// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'TargetedSk... Remove this comment to see the full error message
class TargetedSkill {
  id: $TSFixMe;
  name: $TSFixMe;
  tubeId: $TSFixMe;
  tutorialIds: $TSFixMe;
  constructor({
    id,
    name,
    tubeId,
    tutorialIds
  }: $TSFixMe = {}) {
    this.id = id;
    this.name = name;
    this.tubeId = tubeId;
    this.tutorialIds = tutorialIds;
  }

  get difficulty() {
    return parseInt(this.name.slice(-1));
  }
}

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = TargetedSkill;
