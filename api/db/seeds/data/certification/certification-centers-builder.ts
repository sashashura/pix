// @ts-expect-error TS(6200): Definitions of the following identifiers conflict ... Remove this comment to see the full error message
const _ = require('lodash');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'SCO_COLLEG... Remove this comment to see the full error message
const SCO_COLLEGE_CERTIF_CENTER_ID = 1;
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'SCO_COLLEG... Remove this comment to see the full error message
const SCO_COLLEGE_CERTIF_CENTER_NAME = 'Centre SCO Collège des Anne-Étoiles';
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'SCO_LYCEE_... Remove this comment to see the full error message
const SCO_LYCEE_CERTIF_CENTER_ID = 13;
const SCO_LYCEE_CERTIF_CENTER_NAME = 'Centre SCO Lycée des Anne-Étoiles';
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'PRO_CERTIF... Remove this comment to see the full error message
const PRO_CERTIF_CENTER_ID = 2;
const PRO_CERTIF_CENTER_NAME = 'Centre PRO des Anne-Étoiles';
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'SUP_CERTIF... Remove this comment to see the full error message
const SUP_CERTIF_CENTER_ID = 3;
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'SUP_CERTIF... Remove this comment to see the full error message
const SUP_CERTIF_CENTER_NAME = 'Centre SUP des Anne-Étoiles';
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'DROIT_CERT... Remove this comment to see the full error message
const DROIT_CERTIF_CENTER_ID = 5;
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'DROIT_CERT... Remove this comment to see the full error message
const DROIT_CERTIF_CENTER_NAME = 'Centre DROIT des Anne-Étoiles';
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'SCO_NO_MAN... Remove this comment to see the full error message
const SCO_NO_MANAGING_STUDENTS_CERTIF_CENTER_ID = 6;
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'SCO_NO_MAN... Remove this comment to see the full error message
const SCO_NO_MANAGING_STUDENTS_CERTIF_CENTER_NAME = 'Centre AEFE SCO NO MANAGING STUDENTS des Anne-Étoiles';
const SCO_COLLEGE_EXTERNAL_ID = '1237457A';
const SCO_LYCEE_EXTERNAL_ID = '1237457B';
const SCO_AGRI_EXTERNAL_ID = '1237457C';
const SCO_NO_MANAGING_STUDENTS_EXTERNAL_ID = '1237457E';
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'AGRI_SCO_M... Remove this comment to see the full error message
const AGRI_SCO_MANAGING_STUDENT_ID = 9;
const AGRI_SCO_MANAGING_STUDENT_NAME = 'Centre AGRI des Anne-Etoiles';
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'CLEA_COMPL... Remove this comment to see the full error message
const CLEA_COMPLEMENTARY_CERTIFICATION_ID = 52;
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'PIX_DROIT_... Remove this comment to see the full error message
const PIX_DROIT_COMPLEMENTARY_CERTIFICATION_ID = 53;
const PIX_EDU_1ER_DEGRE_COMPLEMENTARY_CERTIFICATION_ID = 54;
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'PIX_EDU_2N... Remove this comment to see the full error message
const PIX_EDU_2ND_DEGRE_COMPLEMENTARY_CERTIFICATION_ID = 55;

const {
  PIX_EMPLOI_CLEA_BADGE_ID_V1,
  PIX_EMPLOI_CLEA_BADGE_ID_V2,
  PIX_EMPLOI_CLEA_BADGE_ID_V3,
  PIX_DROIT_MAITRE_BADGE_ID,
  PIX_DROIT_EXPERT_BADGE_ID,
  PIX_EDU_FORMATION_INITIALE_2ND_DEGRE_CONFIRME_BADGE_ID,
  PIX_EDU_FORMATION_CONTINUE_2ND_DEGRE_AVANCE_BADGE_ID,
  PIX_EDU_FORMATION_INITIALE_1ER_DEGRE_CONFIRME_BADGE_ID,
  PIX_EDU_FORMATION_CONTINUE_1ER_DEGRE_AVANCE_BADGE_ID,
  PIX_EDU_FORMATION_INITIALE_2ND_DEGRE_INITIE_BADGE_ID,
  PIX_EDU_FORMATION_CONTINUE_2ND_DEGRE_CONFIRME_BADGE_ID,
  PIX_EDU_FORMATION_CONTINUE_2ND_DEGRE_EXPERT_BADGE_ID,
  PIX_EDU_FORMATION_INITIALE_1ER_DEGRE_INITIE_BADGE_ID,
  PIX_EDU_FORMATION_CONTINUE_1ER_DEGRE_CONFIRME_BADGE_ID,
  PIX_EDU_FORMATION_CONTINUE_1ER_DEGRE_EXPERT_BADGE_ID,
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
} = require('../badges-builder');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'certificat... Remove this comment to see the full error message
function certificationCentersBuilder({
  databaseBuilder
}: $TSFixMe) {
  databaseBuilder.factory.buildComplementaryCertification({
    label: 'CléA Numérique',
    key: 'CLEA',
    id: CLEA_COMPLEMENTARY_CERTIFICATION_ID,
  });
  databaseBuilder.factory.buildComplementaryCertificationBadge({
    badgeId: PIX_EMPLOI_CLEA_BADGE_ID_V1,
    level: 1,
    complementaryCertificationId: CLEA_COMPLEMENTARY_CERTIFICATION_ID,
    imageUrl: 'https://images.pix.fr/badges/Pix-emploi.svg',
  });

  databaseBuilder.factory.buildComplementaryCertificationBadge({
    badgeId: PIX_EMPLOI_CLEA_BADGE_ID_V2,
    level: 2,
    complementaryCertificationId: CLEA_COMPLEMENTARY_CERTIFICATION_ID,
    imageUrl: 'https://images.pix.fr/badges/Pix-emploi.svg',
  });

  databaseBuilder.factory.buildComplementaryCertificationBadge({
    badgeId: PIX_EMPLOI_CLEA_BADGE_ID_V3,
    level: 3,
    complementaryCertificationId: CLEA_COMPLEMENTARY_CERTIFICATION_ID,
    imageUrl: 'https://images.pix.fr/badges/Pix-emploi.svg',
  });

  databaseBuilder.factory.buildComplementaryCertification({
    label: 'Pix+ Droit',
    key: 'DROIT',
    id: PIX_DROIT_COMPLEMENTARY_CERTIFICATION_ID,
  });

  databaseBuilder.factory.buildComplementaryCertification({
    label: 'Pix+ Édu 2nd degré',
    key: 'EDU_2ND_DEGRE',
    id: PIX_EDU_2ND_DEGRE_COMPLEMENTARY_CERTIFICATION_ID,
  });

  databaseBuilder.factory.buildComplementaryCertification({
    label: 'Pix+ Édu 1er degré',
    key: 'EDU_1ER_DEGRE',
    id: PIX_EDU_1ER_DEGRE_COMPLEMENTARY_CERTIFICATION_ID,
  });

  databaseBuilder.factory.buildComplementaryCertificationBadge({
    badgeId: PIX_DROIT_MAITRE_BADGE_ID,
    level: 1,
    complementaryCertificationId: PIX_DROIT_COMPLEMENTARY_CERTIFICATION_ID,
    imageUrl: 'https://images.pix.fr/badges-certifies/pix-droit/maitre.svg',
  });
  databaseBuilder.factory.buildComplementaryCertificationBadge({
    badgeId: PIX_DROIT_EXPERT_BADGE_ID,
    level: 2,
    complementaryCertificationId: PIX_DROIT_COMPLEMENTARY_CERTIFICATION_ID,
    imageUrl: 'https://images.pix.fr/badges-certifies/pix-droit/expert.svg',
  });

  databaseBuilder.factory.buildComplementaryCertificationBadge({
    badgeId: PIX_EDU_FORMATION_INITIALE_1ER_DEGRE_INITIE_BADGE_ID,
    level: 1,
    complementaryCertificationId: PIX_EDU_1ER_DEGRE_COMPLEMENTARY_CERTIFICATION_ID,
    imageUrl: 'https://images.pix.fr/badges/Pix_plus_Edu-certif-Autonome_PREMIER-DEGRE.svg',
  });
  databaseBuilder.factory.buildComplementaryCertificationBadge({
    badgeId: PIX_EDU_FORMATION_INITIALE_2ND_DEGRE_INITIE_BADGE_ID,
    level: 1,
    complementaryCertificationId: PIX_EDU_2ND_DEGRE_COMPLEMENTARY_CERTIFICATION_ID,
    imageUrl: 'https://images.pix.fr/badges/Pix_plus_Edu-1-Initie-certif.svg',
  });
  databaseBuilder.factory.buildComplementaryCertificationBadge({
    badgeId: PIX_EDU_FORMATION_INITIALE_1ER_DEGRE_CONFIRME_BADGE_ID,
    level: 2,
    complementaryCertificationId: PIX_EDU_1ER_DEGRE_COMPLEMENTARY_CERTIFICATION_ID,
    imageUrl: 'https://images.pix.fr/badges/Pix_plus_Edu-certif-confirme_PREMIER-DEGRE.svg',
  });
  databaseBuilder.factory.buildComplementaryCertificationBadge({
    badgeId: PIX_EDU_FORMATION_INITIALE_2ND_DEGRE_CONFIRME_BADGE_ID,
    level: 2,
    complementaryCertificationId: PIX_EDU_2ND_DEGRE_COMPLEMENTARY_CERTIFICATION_ID,
    imageUrl: 'https://images.pix.fr/badges/Pix_plus_Edu-2-Confirme-certif.svg',
  });
  databaseBuilder.factory.buildComplementaryCertificationBadge({
    badgeId: PIX_EDU_FORMATION_CONTINUE_1ER_DEGRE_CONFIRME_BADGE_ID,
    level: 3,
    complementaryCertificationId: PIX_EDU_1ER_DEGRE_COMPLEMENTARY_CERTIFICATION_ID,
    imageUrl: 'https://images.pix.fr/badges/Pix_plus_Edu-certif-confirme_PREMIER-DEGRE.svg',
  });
  databaseBuilder.factory.buildComplementaryCertificationBadge({
    badgeId: PIX_EDU_FORMATION_CONTINUE_2ND_DEGRE_CONFIRME_BADGE_ID,
    level: 3,
    complementaryCertificationId: PIX_EDU_2ND_DEGRE_COMPLEMENTARY_CERTIFICATION_ID,
    imageUrl: 'https://images.pix.fr/badges/Pix_plus_Edu-2-Confirme-certif.svg',
  });
  databaseBuilder.factory.buildComplementaryCertificationBadge({
    badgeId: PIX_EDU_FORMATION_CONTINUE_1ER_DEGRE_AVANCE_BADGE_ID,
    level: 4,
    complementaryCertificationId: PIX_EDU_1ER_DEGRE_COMPLEMENTARY_CERTIFICATION_ID,
    imageUrl: 'https://images.pix.fr/badges/Pix_plus_Edu-certif-avance_PREMIER-DEGRE.svg',
  });
  databaseBuilder.factory.buildComplementaryCertificationBadge({
    badgeId: PIX_EDU_FORMATION_CONTINUE_2ND_DEGRE_AVANCE_BADGE_ID,
    level: 4,
    complementaryCertificationId: PIX_EDU_2ND_DEGRE_COMPLEMENTARY_CERTIFICATION_ID,
    imageUrl: 'https://images.pix.fr/badges/Pix_plus_Edu-3-Avance-certif.svg',
  });
  databaseBuilder.factory.buildComplementaryCertificationBadge({
    badgeId: PIX_EDU_FORMATION_CONTINUE_1ER_DEGRE_EXPERT_BADGE_ID,
    level: 5,
    complementaryCertificationId: PIX_EDU_1ER_DEGRE_COMPLEMENTARY_CERTIFICATION_ID,
    imageUrl: 'https://images.pix.fr/badges/Pix_plus_Edu-certif-Expert_PREMIER-DEGRE.svg',
  });
  databaseBuilder.factory.buildComplementaryCertificationBadge({
    badgeId: PIX_EDU_FORMATION_CONTINUE_2ND_DEGRE_EXPERT_BADGE_ID,
    level: 5,
    complementaryCertificationId: PIX_EDU_2ND_DEGRE_COMPLEMENTARY_CERTIFICATION_ID,
    imageUrl: 'https://images.pix.fr/badges/Pix_plus_Edu-4-Expert-certif.svg',
  });

  databaseBuilder.factory.buildCertificationCenter({
    id: SCO_COLLEGE_CERTIF_CENTER_ID,
    name: SCO_COLLEGE_CERTIF_CENTER_NAME,
    externalId: SCO_COLLEGE_EXTERNAL_ID,
    type: 'SCO',
  });

  databaseBuilder.factory.buildCertificationCenter({
    id: SCO_LYCEE_CERTIF_CENTER_ID,
    name: SCO_LYCEE_CERTIF_CENTER_NAME,
    externalId: SCO_LYCEE_EXTERNAL_ID,
    type: 'SCO',
  });

  databaseBuilder.factory.buildCertificationCenter({
    id: SCO_NO_MANAGING_STUDENTS_CERTIF_CENTER_ID,
    name: SCO_NO_MANAGING_STUDENTS_CERTIF_CENTER_NAME,
    externalId: SCO_NO_MANAGING_STUDENTS_EXTERNAL_ID,
    type: 'SCO',
  });

  databaseBuilder.factory.buildCertificationCenter({
    id: AGRI_SCO_MANAGING_STUDENT_ID,
    name: AGRI_SCO_MANAGING_STUDENT_NAME,
    externalId: SCO_AGRI_EXTERNAL_ID,
    type: 'SCO',
  });

  databaseBuilder.factory.buildCertificationCenter({
    id: PRO_CERTIF_CENTER_ID,
    name: PRO_CERTIF_CENTER_NAME,
    type: 'PRO',
    isSupervisorAccessEnabled: 'true',
  });
  databaseBuilder.factory.buildComplementaryCertificationHabilitation({
    certificationCenterId: PRO_CERTIF_CENTER_ID,
    complementaryCertificationId: CLEA_COMPLEMENTARY_CERTIFICATION_ID,
  });

  databaseBuilder.factory.buildCertificationCenter({
    id: SUP_CERTIF_CENTER_ID,
    name: SUP_CERTIF_CENTER_NAME,
    type: 'SUP',
  });
  databaseBuilder.factory.buildComplementaryCertificationHabilitation({
    certificationCenterId: SUP_CERTIF_CENTER_ID,
    complementaryCertificationId: CLEA_COMPLEMENTARY_CERTIFICATION_ID,
  });
  databaseBuilder.factory.buildComplementaryCertificationHabilitation({
    certificationCenterId: SUP_CERTIF_CENTER_ID,
    complementaryCertificationId: PIX_DROIT_COMPLEMENTARY_CERTIFICATION_ID,
  });

  databaseBuilder.factory.buildCertificationCenter({
    id: DROIT_CERTIF_CENTER_ID,
    name: DROIT_CERTIF_CENTER_NAME,
    type: 'SUP',
  });
  databaseBuilder.factory.buildComplementaryCertificationHabilitation({
    certificationCenterId: DROIT_CERTIF_CENTER_ID,
    complementaryCertificationId: PIX_DROIT_COMPLEMENTARY_CERTIFICATION_ID,
  });

  for (let i = 0; i < 200; i++) {
    const types = ['SCO', 'PRO', 'SUP'];
    databaseBuilder.factory.buildCertificationCenter({
      name: `Centre Certif Iteration ${i}`,
      type: types[_.random(0, 2)],
    });
  }
}

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  certificationCentersBuilder,
  SCO_COLLEGE_CERTIF_CENTER_ID,
  SCO_COLLEGE_CERTIF_CENTER_NAME,
  PRO_CERTIF_CENTER_ID,
  PRO_CERTIF_CENTER_NAME,
  SUP_CERTIF_CENTER_ID,
  SUP_CERTIF_CENTER_NAME,
  DROIT_CERTIF_CENTER_ID,
  DROIT_CERTIF_CENTER_NAME,
  SCO_NO_MANAGING_STUDENTS_CERTIF_CENTER_ID,
  SCO_NO_MANAGING_STUDENTS_CERTIF_CENTER_NAME,
  AGRI_SCO_MANAGING_STUDENT_ID,
  AGRI_SCO_MANAGING_STUDENT_NAME,
  SCO_LYCEE_CERTIF_CENTER_ID,
  SCO_LYCEE_CERTIF_CENTER_NAME,
  CLEA_COMPLEMENTARY_CERTIFICATION_ID,
  PIX_DROIT_COMPLEMENTARY_CERTIFICATION_ID,
  PIX_EDU_2ND_DEGRE_COMPLEMENTARY_CERTIFICATION_ID,
};
