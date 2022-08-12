// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'monitoring... Remove this comment to see the full error message
const monitoringTools = require('../monitoring-tools');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Participat... Remove this comment to see the full error message
const ParticipationResultCalculationJob = require('../jobs/campaign-result/ParticipationResultCalculationJob');

function build(classToInstanciate: $TSFixMe, domainTransaction: $TSFixMe) {
  const dependencies = _buildDependencies(domainTransaction);

  return new classToInstanciate(dependencies);
}

function _buildDependencies(domainTransaction: $TSFixMe) {
  return {
    monitoringTools,
    participationResultCalculationJob: new ParticipationResultCalculationJob(domainTransaction.knexTransaction),
    // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
    participantResultsSharedRepository: require('../repositories/participant-results-shared-repository'),
    // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
    campaignParticipationRepository: require('../repositories/campaign-participation-repository'),
  };
}

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  build,
};
