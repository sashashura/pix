// @ts-expect-error TS(2300): Duplicate identifier 'Competence'.
class Competence {
  area: $TSFixMe;
  id: $TSFixMe;
  name: $TSFixMe;
  constructor({
    id,
    name,
    area
  }: $TSFixMe = {}) {
    this.id = id;
    this.name = name;
    this.area = area;
  }
}

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = Competence;
