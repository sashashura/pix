// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Hint'.
class Hint {
  skillName: $TSFixMe;
  value: $TSFixMe;
  constructor({
    skillName,
    value
  }: $TSFixMe = {}) {
    this.skillName = skillName;
    this.value = value;
  }
}

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = Hint;
