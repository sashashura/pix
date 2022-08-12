// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'EuropeanNu... Remove this comment to see the full error message
class EuropeanNumericLevel {
  competenceId: $TSFixMe;
  domainCompetenceId: $TSFixMe;
  level: $TSFixMe;
  constructor({
    domainCompetenceId,
    competenceId,
    level
  }: $TSFixMe) {
    this.domainCompetenceId = domainCompetenceId;
    this.competenceId = competenceId;
    this.level = level;
  }

  static from({
    competenceCode,
    level
  }: $TSFixMe) {
    const [domainCompetenceId, competenceId] = competenceCode.split('.');
    return new EuropeanNumericLevel({ domainCompetenceId, competenceId, level });
  }
}

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = EuropeanNumericLevel;
