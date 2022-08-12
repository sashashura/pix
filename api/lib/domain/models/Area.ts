// @ts-expect-error TS(2300): Duplicate identifier 'Area'.
class Area {
  code: $TSFixMe;
  color: $TSFixMe;
  competences: $TSFixMe;
  frameworkId: $TSFixMe;
  id: $TSFixMe;
  name: $TSFixMe;
  title: $TSFixMe;
  constructor({
    id,
    code,
    name,
    title,
    color,

    // list of Competence domain objects
    competences = [],

    frameworkId
  }: $TSFixMe = {}) {
    this.id = id;
    this.code = code;
    this.name = name;
    this.title = title;
    this.color = color;
    this.competences = competences;
    this.frameworkId = frameworkId;
  }
}

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = Area;
