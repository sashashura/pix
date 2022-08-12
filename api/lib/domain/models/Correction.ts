// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Correction... Remove this comment to see the full error message
class Correction {
  hint: $TSFixMe;
  id: $TSFixMe;
  learningMoreTutorials: $TSFixMe;
  solution: $TSFixMe;
  solutionToDisplay: $TSFixMe;
  tutorials: $TSFixMe;
  constructor({
    id,
    solution,
    solutionToDisplay,
    hint,
    tutorials = [],
    learningMoreTutorials = []
  }: $TSFixMe = {}) {
    this.id = id;
    this.solution = solution;
    this.solutionToDisplay = solutionToDisplay;
    this.hint = hint;
    this.tutorials = tutorials;
    this.learningMoreTutorials = learningMoreTutorials;
  }
}

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = Correction;
