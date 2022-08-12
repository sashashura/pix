// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'TargetedAr... Remove this comment to see the full error message
class TargetedArea {
  code: $TSFixMe;
  color: $TSFixMe;
  competences: $TSFixMe;
  frameworkId: $TSFixMe;
  id: $TSFixMe;
  title: $TSFixMe;
  constructor({
    id,
    code,
    title,
    color,
    frameworkId,
    competences = []
  }: $TSFixMe = {}) {
    this.id = id;
    this.code = code;
    this.title = title;
    this.color = color;
    this.frameworkId = frameworkId;
    this.competences = competences;
  }

  hasCompetence(competenceId: $TSFixMe) {
    return this.competences.some((competence: $TSFixMe) => competence.id === competenceId);
  }
}

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = TargetedArea;
