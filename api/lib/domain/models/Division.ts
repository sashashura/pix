// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Division'.
class Division {
  name: $TSFixMe;
  constructor({
    name
  }: $TSFixMe = {}) {
    this.name = name;
  }
}

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = Division;
