// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Framework'... Remove this comment to see the full error message
class Framework {
  id: $TSFixMe;
  name: $TSFixMe;
  constructor({
    id,
    name
  }: $TSFixMe = {}) {
    this.id = id;
    this.name = name;
  }
}

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = Framework;
