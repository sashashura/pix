/**
 * Traduction: Élément de correction portant sur la conformité d'une réponse
 * Context:    Objet existant dans le cadre de la correction d'une réponse pendant le fonctionnement
 *             interne de l'algorithme.
 */
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Validation... Remove this comment to see the full error message
class Validation {
  result: $TSFixMe;
  resultDetails: $TSFixMe;
  constructor({
    result,
    resultDetails
  }: $TSFixMe = {}) {
    this.result = result;
    this.resultDetails = resultDetails;
  }
}

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = Validation;
