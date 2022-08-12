// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'PIX_SCO_CE... Remove this comment to see the full error message
const PIX_SCO_CERTIF_USER_ID = 100;
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'PIX_PRO_CE... Remove this comment to see the full error message
const PIX_PRO_CERTIF_USER_ID = 101;
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'PIX_SUP_CE... Remove this comment to see the full error message
const PIX_SUP_CERTIF_USER_ID = 102;
const PIX_NONE_CERTIF_USER_ID = 103;
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'CERTIF_SUC... Remove this comment to see the full error message
const CERTIF_SUCCESS_USER_ID = 104;
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'CERTIF_FAI... Remove this comment to see the full error message
const CERTIF_FAILURE_USER_ID = 105;
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'CERTIF_REG... Remove this comment to see the full error message
const CERTIF_REGULAR_USER1_ID = 106;
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'CERTIF_REG... Remove this comment to see the full error message
const CERTIF_REGULAR_USER2_ID = 107;
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'CERTIF_REG... Remove this comment to see the full error message
const CERTIF_REGULAR_USER3_ID = 108;
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'CERTIF_REG... Remove this comment to see the full error message
const CERTIF_REGULAR_USER4_ID = 109;
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'CERTIF_REG... Remove this comment to see the full error message
const CERTIF_REGULAR_USER5_ID = 110;
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'CERTIF_DRO... Remove this comment to see the full error message
const CERTIF_DROIT_USER5_ID = 111;
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'CERTIF_REG... Remove this comment to see the full error message
const CERTIF_REGULAR_USER_WITH_TIMED_CHALLENGE_ID = 112;
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'CERTIF_EDU... Remove this comment to see the full error message
const CERTIF_EDU_FORMATION_INITIALE_2ND_DEGRE_USER_ID = 113;
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'CERTIF_EDU... Remove this comment to see the full error message
const CERTIF_EDU_FORMATION_CONTINUE_2ND_DEGRE_USER_ID = 114;
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'CERTIF_EDU... Remove this comment to see the full error message
const CERTIF_EDU_FORMATION_INITIALE_1ER_DEGRE_USER_ID = 115;
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'CERTIF_EDU... Remove this comment to see the full error message
const CERTIF_EDU_FORMATION_CONTINUE_1ER_DEGRE_USER_ID = 116;
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'DEFAULT_PA... Remove this comment to see the full error message
const { DEFAULT_PASSWORD } = require('../users-builder');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'SCO_STUDEN... Remove this comment to see the full error message
const { SCO_STUDENT_ID } = require('../organizations-sco-builder');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'certificat... Remove this comment to see the full error message
function certificationUsersBuilder({
  databaseBuilder
}: $TSFixMe) {
  databaseBuilder.factory.buildUser.withRawPassword({
    id: PIX_SCO_CERTIF_USER_ID,
    firstName: 'SCO',
    lastName: 'Certification',
    email: 'certifsco@example.net',
    rawPassword: DEFAULT_PASSWORD,
    cgu: true,
  });

  databaseBuilder.factory.buildUser.withRawPassword({
    id: PIX_PRO_CERTIF_USER_ID,
    firstName: 'PRO',
    lastName: 'Certification',
    email: 'certifpro@example.net',
    rawPassword: DEFAULT_PASSWORD,
    cgu: true,
  });

  databaseBuilder.factory.buildUser.withRawPassword({
    id: PIX_SUP_CERTIF_USER_ID,
    firstName: 'SUP',
    lastName: 'Certification',
    email: 'certifsup@example.net',
    rawPassword: DEFAULT_PASSWORD,
    cgu: true,
  });

  databaseBuilder.factory.buildUser.withRawPassword({
    id: PIX_NONE_CERTIF_USER_ID,
    firstName: 'NONE',
    lastName: 'Certification',
    email: 'certifnone@example.net',
    rawPassword: DEFAULT_PASSWORD,
    cgu: true,
  });

  databaseBuilder.factory.buildUser.withRawPassword({
    id: CERTIF_SUCCESS_USER_ID,
    firstName: 'AnneSuccess',
    lastName: 'Certif',
    email: 'certif-success@example.net',
    rawPassword: DEFAULT_PASSWORD,
    cgu: true,
  });

  databaseBuilder.factory.buildUser.withRawPassword({
    id: CERTIF_FAILURE_USER_ID,
    firstName: 'AnneFailure',
    lastName: 'Certif',
    email: 'certif-failure@example.net',
    rawPassword: DEFAULT_PASSWORD,
    cgu: true,
  });

  databaseBuilder.factory.buildUser.withRawPassword({
    id: CERTIF_REGULAR_USER1_ID,
    firstName: 'AnneNormale1',
    lastName: 'Certif1',
    email: 'certif1@example.net',
    rawPassword: DEFAULT_PASSWORD,
    cgu: true,
  });

  databaseBuilder.factory.buildUser.withRawPassword({
    id: CERTIF_REGULAR_USER2_ID,
    firstName: 'AnneNormale2',
    lastName: 'Certif2',
    email: 'certif2@example.net',
    rawPassword: DEFAULT_PASSWORD,
    cgu: true,
  });

  databaseBuilder.factory.buildUser.withRawPassword({
    id: CERTIF_REGULAR_USER3_ID,
    firstName: 'AnneNormale3',
    lastName: 'Certif3',
    email: 'certif3@example.net',
    rawPassword: DEFAULT_PASSWORD,
    cgu: true,
  });

  databaseBuilder.factory.buildUser.withRawPassword({
    id: CERTIF_REGULAR_USER4_ID,
    firstName: 'AnneNormale4',
    lastName: 'Certif4',
    email: 'certif4@example.net',
    rawPassword: DEFAULT_PASSWORD,
    cgu: true,
  });

  databaseBuilder.factory.buildUser.withRawPassword({
    id: CERTIF_REGULAR_USER5_ID,
    firstName: 'AnneNormale5',
    lastName: 'Certif5',
    email: 'certif5@example.net',
    rawPassword: DEFAULT_PASSWORD,
    cgu: true,
  });

  databaseBuilder.factory.buildUser.withRawPassword({
    id: CERTIF_DROIT_USER5_ID,
    firstName: 'AnneCertifDroit',
    lastName: 'Certif6',
    email: 'certifdroit@example.net',
    rawPassword: DEFAULT_PASSWORD,
    cgu: true,
  });

  databaseBuilder.factory.buildUser.withRawPassword({
    id: CERTIF_REGULAR_USER_WITH_TIMED_CHALLENGE_ID,
    firstName: 'AnneCertifTimedChallenge',
    lastName: 'CertifTimedChallenge',
    email: 'certif-timed-challenge@example.net',
    rawPassword: DEFAULT_PASSWORD,
    cgu: true,
  });

  databaseBuilder.factory.buildUser.withRawPassword({
    id: CERTIF_EDU_FORMATION_INITIALE_2ND_DEGRE_USER_ID,
    firstName: 'AnneCertifEdu',
    lastName: 'Formation Initiale 2nd Degré',
    email: 'certifedu.2nd.initiale@example.net',
    rawPassword: DEFAULT_PASSWORD,
    cgu: true,
  });

  databaseBuilder.factory.buildUser.withRawPassword({
    id: CERTIF_EDU_FORMATION_CONTINUE_2ND_DEGRE_USER_ID,
    firstName: 'AnneCertifEdu',
    lastName: 'Formation Continue 2nd Degré',
    email: 'certifedu.2nd.continue@example.net',
    rawPassword: DEFAULT_PASSWORD,
    cgu: true,
  });

  databaseBuilder.factory.buildUser.withRawPassword({
    id: CERTIF_EDU_FORMATION_INITIALE_1ER_DEGRE_USER_ID,
    firstName: 'AnneCertifEdu',
    lastName: 'Formation Initiale 1er Degré',
    email: 'certifedu.1er.initiale@example.net',
    rawPassword: DEFAULT_PASSWORD,
    cgu: true,
  });

  databaseBuilder.factory.buildUser.withRawPassword({
    id: CERTIF_EDU_FORMATION_CONTINUE_1ER_DEGRE_USER_ID,
    firstName: 'AnneCertifEdu',
    lastName: 'Formation Continue 1er Degré',
    email: 'certifedu.1er.continue@example.net',
    rawPassword: DEFAULT_PASSWORD,
    cgu: true,
  });
}

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  certificationUsersBuilder,
  PIX_SCO_CERTIF_USER_ID,
  CERTIF_SCO_STUDENT_ID: SCO_STUDENT_ID,
  PIX_PRO_CERTIF_USER_ID,
  PIX_SUP_CERTIF_USER_ID,
  PIX_NONE_CERTIF_USER_ID,
  CERTIF_SUCCESS_USER_ID,
  CERTIF_FAILURE_USER_ID,
  CERTIF_REGULAR_USER1_ID,
  CERTIF_REGULAR_USER2_ID,
  CERTIF_REGULAR_USER3_ID,
  CERTIF_REGULAR_USER4_ID,
  CERTIF_REGULAR_USER5_ID,
  CERTIF_DROIT_USER5_ID,
  CERTIF_REGULAR_USER_WITH_TIMED_CHALLENGE_ID,
  CERTIF_EDU_FORMATION_INITIALE_2ND_DEGRE_USER_ID,
  CERTIF_EDU_FORMATION_CONTINUE_2ND_DEGRE_USER_ID,
  CERTIF_EDU_FORMATION_INITIALE_1ER_DEGRE_USER_ID,
  CERTIF_EDU_FORMATION_CONTINUE_1ER_DEGRE_USER_ID,
};
