// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Badge'.
const Badge = require('../../../../lib/domain/models/Badge');
const {
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'CERTIFICAT... Remove this comment to see the full error message
  CERTIFICATION_COURSE_SUCCESS_ID,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'CERTIFICAT... Remove this comment to see the full error message
  CERTIFICATION_COURSE_FAILURE_ID,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'CERTIFICAT... Remove this comment to see the full error message
  CERTIFICATION_COURSE_EDU_ID,
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
} = require('./certification-courses-builder');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'PIX_DROIT_... Remove this comment to see the full error message
const { PIX_DROIT_MAITRE_BADGE_ID } = require('../badges-builder');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'CERTIF_DRO... Remove this comment to see the full error message
const { CERTIF_DROIT_USER5_ID } = require('./users');
const {
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'CLEA_COMPL... Remove this comment to see the full error message
  CLEA_COMPLEMENTARY_CERTIFICATION_ID,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'PIX_DROIT_... Remove this comment to see the full error message
  PIX_DROIT_COMPLEMENTARY_CERTIFICATION_ID,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'PIX_EDU_2N... Remove this comment to see the full error message
  PIX_EDU_2ND_DEGRE_COMPLEMENTARY_CERTIFICATION_ID,
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
} = require('./certification-centers-builder');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'complement... Remove this comment to see the full error message
function complementaryCertificationCourseResultsBuilder({
  databaseBuilder
}: $TSFixMe) {
  databaseBuilder.factory.buildBadgeAcquisition({
    badgeId: PIX_DROIT_MAITRE_BADGE_ID,
    userId: CERTIF_DROIT_USER5_ID,
    campaignParticipationId: null,
  });
  const { id: complementaryCertifCourseSuccessCleaId } = databaseBuilder.factory.buildComplementaryCertificationCourse({
    certificationCourseId: CERTIFICATION_COURSE_SUCCESS_ID,
    complementaryCertificationId: CLEA_COMPLEMENTARY_CERTIFICATION_ID,
  });
  databaseBuilder.factory.buildComplementaryCertificationCourseResult({
    complementaryCertificationCourseId: complementaryCertifCourseSuccessCleaId,
    acquired: true,
    partnerKey: Badge.keys.PIX_EMPLOI_CLEA_V3,
  });

  const { id: complementaryCertifCourseFailureId } = databaseBuilder.factory.buildComplementaryCertificationCourse({
    certificationCourseId: CERTIFICATION_COURSE_FAILURE_ID,
    complementaryCertificationId: CLEA_COMPLEMENTARY_CERTIFICATION_ID,
  });
  databaseBuilder.factory.buildComplementaryCertificationCourseResult({
    complementaryCertificationCourseId: complementaryCertifCourseFailureId,
    acquired: false,
    partnerKey: Badge.keys.PIX_EMPLOI_CLEA_V3,
  });

  const { id: complementaryCertifCourseSuccessDroitId } = databaseBuilder.factory.buildComplementaryCertificationCourse(
    {
      certificationCourseId: CERTIFICATION_COURSE_SUCCESS_ID,
      complementaryCertificationId: PIX_DROIT_COMPLEMENTARY_CERTIFICATION_ID,
    },
  );
  databaseBuilder.factory.buildComplementaryCertificationCourseResult({
    complementaryCertificationCourseId: complementaryCertifCourseSuccessDroitId,
    acquired: true,
    partnerKey: Badge.keys.PIX_DROIT_MAITRE_CERTIF,
  });

  const { id: complementaryCertifCourseEduId } = databaseBuilder.factory.buildComplementaryCertificationCourse({
    certificationCourseId: CERTIFICATION_COURSE_EDU_ID,
    complementaryCertificationId: PIX_EDU_2ND_DEGRE_COMPLEMENTARY_CERTIFICATION_ID,
  });
  databaseBuilder.factory.buildComplementaryCertificationCourseResult({
    complementaryCertificationCourseId: complementaryCertifCourseEduId,
    acquired: true,
    partnerKey: Badge.keys.PIX_EDU_FORMATION_INITIALE_1ER_DEGRE_INITIE,
  });
}

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  complementaryCertificationCourseResultsBuilder,
};
