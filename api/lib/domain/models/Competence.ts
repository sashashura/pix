// @ts-expect-error TS(2300): Duplicate identifier 'Competence'.
class Competence {
  area: $TSFixMe;
  description: $TSFixMe;
  id: $TSFixMe;
  index: $TSFixMe;
  level: $TSFixMe;
  name: $TSFixMe;
  origin: $TSFixMe;
  skillIds: $TSFixMe;
  thematicIds: $TSFixMe;
  constructor({
    id,
    area,
    name,
    index,
    description,
    origin,
    skillIds = [],
    thematicIds = []
  }: $TSFixMe = {}) {
    this.id = id;
    this.area = area;
    this.name = name;
    this.index = index;
    this.description = description;
    this.origin = origin;
    this.level = -1;
    this.skillIds = skillIds;
    this.thematicIds = thematicIds;
  }

  get reference() {
    return `${this.index} ${this.name}`;
  }
}

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = Competence;
