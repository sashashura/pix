// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const ComplementaryCertificationCourseResultForJuryCertification = require('../../../../lib/domain/read-models/ComplementaryCertificationCourseResultsForJuryCertification');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'PIX_EMPLOI... Remove this comment to see the full error message
const { PIX_EMPLOI_CLEA_V2 } = require('../../../../lib/domain/models/Badge').keys;

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = function buildComplementaryCertificationCourseResultForJuryCertification({
  id = 1234,
  partnerKey = PIX_EMPLOI_CLEA_V2,
  acquired = true,
} = {}) {
  return new ComplementaryCertificationCourseResultForJuryCertification({
    id,
    partnerKey,
    acquired,
  });
};
