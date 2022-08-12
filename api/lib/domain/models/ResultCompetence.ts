// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'ResultComp... Remove this comment to see the full error message
class ResultCompetence {
  id: $TSFixMe;
  index: $TSFixMe;
  level: $TSFixMe;
  name: $TSFixMe;
  score: $TSFixMe;
  constructor({
    id,
    index,
    level,
    name,
    score
  }: $TSFixMe = {}) {
    this.id = id;
    this.index = index;
    this.level = level;
    this.name = name;
    this.score = score;
  }
}

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = ResultCompetence;
