// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'AnswerStat... Remove this comment to see the full error message
const AnswerStatus = require('./AnswerStatus');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Validation... Remove this comment to see the full error message
const Validation = require('./Validation');

/**
 * Traduction: Vérificateur de réponse par défaut
 */
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Validator'... Remove this comment to see the full error message
class Validator {
  solution: $TSFixMe;
  constructor({
    solution
  }: $TSFixMe = {}) {
    this.solution = solution;
  }

  assess() {
    return new Validation({
      result: AnswerStatus.UNIMPLEMENTED,
      resultDetails: null,
    });
  }
}

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = Validator;
