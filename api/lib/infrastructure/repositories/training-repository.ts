// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'trainingDa... Remove this comment to see the full error message
const trainingDatasource = require('../datasources/learning-content/training-datasource');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Training'.
const Training = require('../../domain/models/Training');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  async findByTargetProfileIdAndLocale({
    targetProfileId,
    locale = 'fr-fr'
  }: $TSFixMe) {
    const trainingData = await trainingDatasource.list();
    const trainings = trainingData.filter((training: $TSFixMe) => {
      const hasTargetProfileId = targetProfileId && training.targetProfileIds?.includes(targetProfileId);
      const hasLocale = locale && training.locale === locale;
      return hasTargetProfileId && hasLocale;
    });
    return trainings.map(_toDomain);
  },
};

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable '_toDomain'... Remove this comment to see the full error message
function _toDomain(training: $TSFixMe) {
  return new Training(training);
}
