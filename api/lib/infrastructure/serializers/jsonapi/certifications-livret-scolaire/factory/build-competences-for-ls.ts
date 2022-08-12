// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Competence... Remove this comment to see the full error message
const Competence = require('../../../../../../lib/infrastructure/serializers/jsonapi/certifications-livret-scolaire/response-objects/Competence');
const {
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'buildAreaF... Remove this comment to see the full error message
  buildAreaForLS,
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
} = require('../../../../../../lib/infrastructure/serializers/jsonapi/certifications-livret-scolaire/factory/build-area-for-ls');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = function buildCompetenceForLS({
  id,
  name,
  area = buildAreaForLS()
}: $TSFixMe = {}) {
  return new Competence({
    id,
    name,
    area,
  });
};
