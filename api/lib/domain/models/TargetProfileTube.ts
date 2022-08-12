// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'TargetProf... Remove this comment to see the full error message
class TargetProfileTube {
  id: $TSFixMe;
  level: $TSFixMe;
  constructor({
    id,
    level
  }: $TSFixMe = {}) {
    this.id = id;
    this.level = level;
  }
}

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = TargetProfileTube;
