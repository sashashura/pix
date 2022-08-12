// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'PixPlusDro... Remove this comment to see the full error message
const PixPlusDroitCertificationScoring = require('../../../../lib/domain/models/PixPlusDroitCertificationScoring');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'PIX_DROIT_... Remove this comment to see the full error message
const { PIX_DROIT_MAITRE_CERTIF } = require('../../../../lib/domain/models/Badge').keys;
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'buildRepro... Remove this comment to see the full error message
const buildReproducibilityRate = require('./build-reproducibility-rate');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = function buildPixPlusDroitCertificationScoring({
  complementaryCertificationCourseId = 999,
  certifiableBadgeKey = PIX_DROIT_MAITRE_CERTIF,
  reproducibilityRate = buildReproducibilityRate({ value: 100 }),
  hasAcquiredPixCertification = true,
} = {}) {
  return new PixPlusDroitCertificationScoring({
    complementaryCertificationCourseId,
    certifiableBadgeKey,
    reproducibilityRate,
    hasAcquiredPixCertification,
  });
};
