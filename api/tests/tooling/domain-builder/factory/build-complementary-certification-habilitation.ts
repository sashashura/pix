// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Complement... Remove this comment to see the full error message
const ComplementaryCertificationHabilitation = require('../../../../lib/domain/models/ComplementaryCertificationHabilitation');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = function buildComplementaryCertificationHabilitation({
  id = 123,
  complementaryCertificationId = 456,
  certificationCenterId = 789,
} = {}) {
  return new ComplementaryCertificationHabilitation({
    id,
    complementaryCertificationId,
    certificationCenterId,
  });
};
