// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Area'.
const Area = require('../../../../lib/domain/models/Area');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = function buildArea({
  id = 'recArea123',
  code = 5,
  title = 'Super domaine',
  competences = [],
  color = 'red',
  name,
  frameworkId = 'recFmk123'
}: $TSFixMe = {}) {
  name = name || `${code}. ${title}`;
  return new Area({
    id,
    name,
    code,
    title,
    competences,
    color,
    frameworkId,
  });
};
