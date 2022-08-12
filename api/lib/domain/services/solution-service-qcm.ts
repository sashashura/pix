// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable '_'.
const _ = require('../../infrastructure/utils/lodash-utils');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'AnswerStat... Remove this comment to see the full error message
const AnswerStatus = require('../models/AnswerStatus');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  match(answer: $TSFixMe, solution: $TSFixMe) {
    if (_.areCSVequivalent(answer, solution)) {
      return AnswerStatus.OK;
    }
    return AnswerStatus.KO;
  },
};
