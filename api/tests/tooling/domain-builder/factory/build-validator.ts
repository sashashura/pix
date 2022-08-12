// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Validator'... Remove this comment to see the full error message
const Validator = require('../../../../lib/domain/models/Validator');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'ValidatorQ... Remove this comment to see the full error message
const ValidatorQCU = require('../../../../lib/domain/models/ValidatorQCU');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const buildSolution = require('./build-solution');

function buildValidator({ solution = buildSolution() } = {}) {
  return new Validator({
    solution,
  });
}

buildValidator.ofTypeQCU = function ({ solution = buildSolution() } = {}) {
  return new ValidatorQCU({
    solution,
  });
};

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = buildValidator;
