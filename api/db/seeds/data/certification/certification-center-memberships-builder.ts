const {
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'SCO_COLLEG... Remove this comment to see the full error message
  SCO_COLLEGE_CERTIF_CENTER_ID,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'SCO_LYCEE_... Remove this comment to see the full error message
  SCO_LYCEE_CERTIF_CENTER_ID,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'PRO_CERTIF... Remove this comment to see the full error message
  PRO_CERTIF_CENTER_ID,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'SUP_CERTIF... Remove this comment to see the full error message
  SUP_CERTIF_CENTER_ID,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'DROIT_CERT... Remove this comment to see the full error message
  DROIT_CERTIF_CENTER_ID,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'SCO_NO_MAN... Remove this comment to see the full error message
  SCO_NO_MANAGING_STUDENTS_CERTIF_CENTER_ID,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'AGRI_SCO_M... Remove this comment to see the full error message
  AGRI_SCO_MANAGING_STUDENT_ID,
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
} = require('./certification-centers-builder');
const {
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'PIX_SCO_CE... Remove this comment to see the full error message
  PIX_SCO_CERTIF_USER_ID,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'PIX_PRO_CE... Remove this comment to see the full error message
  PIX_PRO_CERTIF_USER_ID,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'PIX_SUP_CE... Remove this comment to see the full error message
  PIX_SUP_CERTIF_USER_ID,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'CERTIF_REG... Remove this comment to see the full error message
  CERTIF_REGULAR_USER1_ID,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'CERTIF_DRO... Remove this comment to see the full error message
  CERTIF_DROIT_USER5_ID,
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
} = require('./users');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = function certificationCenterMembershipsBuilder({
  databaseBuilder
}: $TSFixMe) {
  databaseBuilder.factory.buildCertificationCenterMembership({
    certificationCenterId: SCO_COLLEGE_CERTIF_CENTER_ID,
    userId: PIX_SCO_CERTIF_USER_ID,
  });
  databaseBuilder.factory.buildCertificationCenterMembership({
    certificationCenterId: SCO_LYCEE_CERTIF_CENTER_ID,
    userId: PIX_SCO_CERTIF_USER_ID,
  });
  databaseBuilder.factory.buildCertificationCenterMembership({
    certificationCenterId: SCO_NO_MANAGING_STUDENTS_CERTIF_CENTER_ID,
    userId: PIX_SCO_CERTIF_USER_ID,
  });
  databaseBuilder.factory.buildCertificationCenterMembership({
    certificationCenterId: SCO_COLLEGE_CERTIF_CENTER_ID,
    userId: CERTIF_REGULAR_USER1_ID,
  });
  databaseBuilder.factory.buildCertificationCenterMembership({
    certificationCenterId: AGRI_SCO_MANAGING_STUDENT_ID,
    userId: PIX_SCO_CERTIF_USER_ID,
  });

  databaseBuilder.factory.buildCertificationCenterMembership({ userId: PIX_PRO_CERTIF_USER_ID, certificationCenterId: PRO_CERTIF_CENTER_ID });
  databaseBuilder.factory.buildCertificationCenterMembership({ userId: PIX_SUP_CERTIF_USER_ID, certificationCenterId: SUP_CERTIF_CENTER_ID });
  databaseBuilder.factory.buildCertificationCenterMembership({ userId: CERTIF_DROIT_USER5_ID, certificationCenterId: DROIT_CERTIF_CENTER_ID });
};
