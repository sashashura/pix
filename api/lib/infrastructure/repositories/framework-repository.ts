// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Framework'... Remove this comment to see the full error message
const Framework = require('../../domain/models/Framework');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'frameworkD... Remove this comment to see the full error message
const frameworkDatasource = require('../datasources/learning-content/framework-datasource');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'NotFoundEr... Remove this comment to see the full error message
const { NotFoundError } = require('../../domain/errors');

async function list() {
  const frameworkDataObjects = await frameworkDatasource.list();
  return frameworkDataObjects.map(_toDomain);
}

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable '_toDomain'... Remove this comment to see the full error message
function _toDomain(frameworkData: $TSFixMe) {
  return new Framework({
    id: frameworkData.id,
    name: frameworkData.name,
  });
}

async function getByName(name: $TSFixMe) {
  const framework = await frameworkDatasource.getByName(name);

  if (framework === undefined) {
    // @ts-expect-error TS(2554): Expected 3 arguments, but got 1.
    throw new NotFoundError(`Framework not found for name ${name}`);
  }
  return _toDomain(framework);
}

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  list,
  getByName,
};
