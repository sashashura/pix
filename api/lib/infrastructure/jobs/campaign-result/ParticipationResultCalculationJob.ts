// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Job'.
const Job = require('../JobPgBoss');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Participat... Remove this comment to see the full error message
class ParticipationResultCalculationJob extends Job {
// @ts-expect-error TS(2699): Static property 'name' conflicts with built-in pro... Remove this comment to see the full error message
static name = 'ParticipationResultCalculationJob';

  constructor(queryBuilder: $TSFixMe) {
    super({ name: 'ParticipationResultCalculationJob', retryLimit: 3 }, queryBuilder);
  }
}

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = ParticipationResultCalculationJob;
