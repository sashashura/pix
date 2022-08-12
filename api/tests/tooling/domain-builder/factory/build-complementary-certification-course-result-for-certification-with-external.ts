// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Complement... Remove this comment to see the full error message
const ComplementaryCertificationCourseResultsForJuryCertificationWithExternal = require('../../../../lib/domain/read-models/ComplementaryCertificationCourseResultsForJuryCertificationWithExternal');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'PIX_EDU_FO... Remove this comment to see the full error message
const { PIX_EDU_FORMATION_CONTINUE_1ER_DEGRE_AVANCE, PIX_EDU_FORMATION_CONTINUE_1ER_DEGRE_EXPERT } =
  // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
  require('../../../../lib/domain/models/Badge').keys;

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = function buildPixEduComplementaryCertificationCourseResultsForJuryCertificationWithExternal({
  complementaryCertificationCourseId = 456,
  pixPartnerKey = PIX_EDU_FORMATION_CONTINUE_1ER_DEGRE_AVANCE,
  pixAcquired = true,
  externalPartnerKey = PIX_EDU_FORMATION_CONTINUE_1ER_DEGRE_EXPERT,
  externalAcquired = true,
} = {}) {
  return new ComplementaryCertificationCourseResultsForJuryCertificationWithExternal({
    complementaryCertificationCourseId,
    pixPartnerKey,
    pixAcquired,
    externalPartnerKey,
    externalAcquired,
  });
};
