const BATCH_SIZE = 10;
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'logger'.
const logger = require('../lib/infrastructure/logger');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'batch'.
function batch(knex: $TSFixMe, elementsToUpdate: $TSFixMe, treatment: $TSFixMe) {
  // @ts-expect-error TS(7023): '_innerTreatment' implicitly has return type 'any'... Remove this comment to see the full error message
  function _innerTreatment(knex: $TSFixMe, remainingElementsToUpdate: $TSFixMe, countOfBatches: $TSFixMe, batchesDone: $TSFixMe) {
    if (remainingElementsToUpdate.length <= 0) {
      return Promise.resolve();
    }

    const assessments = remainingElementsToUpdate.splice(0, BATCH_SIZE);
    const promises = assessments.map((assessment: $TSFixMe) => {
      return treatment(assessment).catch((err: $TSFixMe) => {
        logger.error('Treatment failed for :', assessment);

        throw err;
      });
    });

    return Promise.all(promises)
      .then((results) => {
        logger.info(
          `---- Lot ${batchesDone} : ${results.length} processed - (total: ${countOfBatches} lots, ${
            (batchesDone / countOfBatches) * 100
          }%)`
        );
      })
      .then(() => _innerTreatment(knex, remainingElementsToUpdate, countOfBatches, batchesDone + 1));
  }

  const numberOfTotalBatches = Math.ceil(elementsToUpdate.length / BATCH_SIZE);

  return Promise.resolve().then(() => _innerTreatment(knex, elementsToUpdate, numberOfTotalBatches, 0));
}

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  batch,
};
