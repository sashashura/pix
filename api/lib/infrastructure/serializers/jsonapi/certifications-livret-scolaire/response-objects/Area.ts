// @ts-expect-error TS(2300): Duplicate identifier 'Area'.
class Area {
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
module.exports = Area;
