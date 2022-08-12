// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const solutionServiceQROC = require('../services/solution-service-qroc');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Validation... Remove this comment to see the full error message
const Validation = require('./Validation');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Validator'... Remove this comment to see the full error message
const Validator = require('./Validator');

/**
 * Traduction: Vérificateur de réponse pour un QROC
 */
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'ValidatorQ... Remove this comment to see the full error message
class ValidatorQROC extends Validator {
  solution: $TSFixMe;
  constructor({
    solution
  }: $TSFixMe = {}) {
    super({ solution });
  }

  assess({
    answer,
    challengeFormat
  }: $TSFixMe) {
    const result = solutionServiceQROC.match({ answer: answer.value, solution: this.solution, challengeFormat });

    return new Validation({
      result,
      resultDetails: null,
    });
  }
}

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = ValidatorQROC;
