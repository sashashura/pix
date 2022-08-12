// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'PixPlusEdu... Remove this comment to see the full error message
const PixPlusEduCertificationScoring = require('../../../../lib/domain/models/PixPlusEduCertificationScoring');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'PIX_EDU_FO... Remove this comment to see the full error message
const { PIX_EDU_FORMATION_CONTINUE_2ND_DEGRE_CONFIRME } = require('../../../../lib/domain/models/Badge').keys;
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'buildRepro... Remove this comment to see the full error message
const buildReproducibilityRate = require('./build-reproducibility-rate');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = function buildPixPlusEduCertificationScoring({
  complementaryCertificationCourseId = 999,
  certifiableBadgeKey = PIX_EDU_FORMATION_CONTINUE_2ND_DEGRE_CONFIRME,
  reproducibilityRate = buildReproducibilityRate({ value: 100 }),
  hasAcquiredPixCertification = true,
} = {}) {
  return new PixPlusEduCertificationScoring({
    complementaryCertificationCourseId,
    certifiableBadgeKey,
    reproducibilityRate,
    hasAcquiredPixCertification,
  });
};
