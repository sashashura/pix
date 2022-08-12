// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'jsYaml'.
const jsYaml = require('js-yaml');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'levenshtei... Remove this comment to see the full error message
const levenshtein = require('fast-levenshtein');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable '_'.
const _ = require('../../infrastructure/utils/lodash-utils');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'logger'.
const logger = require('../../infrastructure/logger');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'applyPreTr... Remove this comment to see the full error message
const { applyPreTreatments, applyTreatments } = require('./validation-treatments');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'YamlParsin... Remove this comment to see the full error message
const { YamlParsingError } = require('../../domain/errors');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'AnswerStat... Remove this comment to see the full error message
const AnswerStatus = require('../models/AnswerStatus');

function _applyTreatmentsToSolutions(solutions: $TSFixMe, enabledTreatments: $TSFixMe, qrocBlocksTypes = {}) {
  return _.forEach(solutions, (solution: $TSFixMe, solutionKey: $TSFixMe) => {
    solution.forEach((variant: $TSFixMe, variantIndex: $TSFixMe) => {
      // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
      if (qrocBlocksTypes[solutionKey] === 'select') {
        solutions[solutionKey][variantIndex] = applyTreatments(variant, []);
      } else {
        solutions[solutionKey][variantIndex] = applyTreatments(variant, enabledTreatments);
      }
    });
  });
}

function _applyTreatmentsToAnswers(answers: $TSFixMe, enabledTreatments: $TSFixMe, qrocBlocksTypes = {}) {
  return _.forEach(answers, (answer: $TSFixMe, answerKey: $TSFixMe) => {
    // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
    if (qrocBlocksTypes[answerKey] === 'select') {
      answers[answerKey] = applyTreatments(answer, []);
    } else {
      answers[answerKey] = applyTreatments(answer, enabledTreatments);
    }
  });
}

function _areApproximatelyEqualAccordingToLevenshteinDistanceRatio(answer: $TSFixMe, solutionVariants: $TSFixMe) {
  let smallestLevenshteinDistance = answer.length;
  solutionVariants.forEach((variant: $TSFixMe) => {
    const levenshteinDistance = levenshtein.get(answer, variant);
    smallestLevenshteinDistance = Math.min(smallestLevenshteinDistance, levenshteinDistance);
  });
  const ratio = smallestLevenshteinDistance / answer.length;
  return ratio <= 0.25;
}

function _compareAnswersAndSolutions(answers: $TSFixMe, solutions: $TSFixMe, enabledTreatments: $TSFixMe, qrocBlocksTypes = {}) {
  const results = {};
  _.map(answers, (answer: $TSFixMe, answerKey: $TSFixMe) => {
    const solutionVariants = solutions[answerKey];
    if (!solutionVariants) {
      logger.warn(
        `[ERREUR CLE ANSWER] La clé ${answerKey} n'existe pas. Première clé de l'épreuve : ${Object.keys(solutions)[0]}`
      );
      throw new YamlParsingError();
    }
    // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
    if (enabledTreatments.includes('t3') && qrocBlocksTypes[answerKey] != 'select') {
      // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
      results[answerKey] = _areApproximatelyEqualAccordingToLevenshteinDistanceRatio(answer, solutionVariants);
    } else if (solutionVariants) {
      // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
      results[answerKey] = solutionVariants.includes(answer);
    }
  });
  return results;
}

function _formatResult(resultDetails: $TSFixMe) {
  let result = AnswerStatus.OK;
  _.forEach(resultDetails, (resultDetail: $TSFixMe) => {
    if (!resultDetail) {
      result = AnswerStatus.KO;
    }
  });
  return result;
}

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  _applyTreatmentsToSolutions,
  _applyTreatmentsToAnswers,
  _compareAnswersAndSolutions,
  _formatResult,

  match({
    answerValue,
    solution
  }: $TSFixMe) {
    const yamlSolution = solution.value;
    const enabledTreatments = solution.enabledTreatments;
    const qrocBlocksTypes = solution.qrocBlocksTypes || {};

    // Input checking
    if (!_.isString(answerValue) || _.isEmpty(yamlSolution) || !_.includes(yamlSolution, '\n')) {
      return { result: AnswerStatus.KO };
    }

    // Pre-treatments
    const preTreatedAnswers = applyPreTreatments(answerValue);
    const preTreatedSolutions = applyPreTreatments(yamlSolution);

    // Convert YAML to JSObject
    let answers, solutions;

    try {
      answers = jsYaml.load(preTreatedAnswers, { schema: jsYaml.FAILSAFE_SCHEMA });
      solutions = jsYaml.load(preTreatedSolutions, { schema: jsYaml.FAILSAFE_SCHEMA });
    } catch (error) {
      throw new YamlParsingError();
    }

    // Treatments
    const treatedSolutions = _applyTreatmentsToSolutions(solutions, enabledTreatments, qrocBlocksTypes);
    const treatedAnswers = _applyTreatmentsToAnswers(answers, enabledTreatments, qrocBlocksTypes);

    // Comparison
    const resultDetails = _compareAnswersAndSolutions(
      treatedAnswers,
      treatedSolutions,
      enabledTreatments,
      qrocBlocksTypes
    );

    // Restitution
    return {
      result: _formatResult(resultDetails),
      resultDetails: resultDetails,
    };
  },
};
