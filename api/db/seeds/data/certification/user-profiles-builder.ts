// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'bluebird'.
const bluebird = require('bluebird');
const {
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'CERTIF_SUC... Remove this comment to see the full error message
  CERTIF_SUCCESS_USER_ID,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'CERTIF_FAI... Remove this comment to see the full error message
  CERTIF_FAILURE_USER_ID,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'CERTIF_REG... Remove this comment to see the full error message
  CERTIF_REGULAR_USER1_ID,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'CERTIF_REG... Remove this comment to see the full error message
  CERTIF_REGULAR_USER2_ID,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'CERTIF_REG... Remove this comment to see the full error message
  CERTIF_REGULAR_USER3_ID,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'CERTIF_REG... Remove this comment to see the full error message
  CERTIF_REGULAR_USER4_ID,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'CERTIF_REG... Remove this comment to see the full error message
  CERTIF_REGULAR_USER5_ID,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'CERTIF_SCO... Remove this comment to see the full error message
  CERTIF_SCO_STUDENT_ID,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'CERTIF_REG... Remove this comment to see the full error message
  CERTIF_REGULAR_USER_WITH_TIMED_CHALLENGE_ID,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'CERTIF_DRO... Remove this comment to see the full error message
  CERTIF_DROIT_USER5_ID,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'CERTIF_EDU... Remove this comment to see the full error message
  CERTIF_EDU_FORMATION_INITIALE_2ND_DEGRE_USER_ID,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'CERTIF_EDU... Remove this comment to see the full error message
  CERTIF_EDU_FORMATION_CONTINUE_2ND_DEGRE_USER_ID,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'CERTIF_EDU... Remove this comment to see the full error message
  CERTIF_EDU_FORMATION_INITIALE_1ER_DEGRE_USER_ID,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'CERTIF_EDU... Remove this comment to see the full error message
  CERTIF_EDU_FORMATION_CONTINUE_1ER_DEGRE_USER_ID,
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
} = require('./users');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'makeUserPi... Remove this comment to see the full error message
const { makeUserPixCertifiable, makeUserPixDroitCertifiable } = require('./tooling');
const {
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'WEAK_CERTI... Remove this comment to see the full error message
  WEAK_CERTIFIABLE_WITH_TIMED_CHALLENGE_PROFILE_DATA_OBJECTS_FOR_BUILDING_ANSWERS_AND_KNOWLEDGE_ELEMENTS,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'PIX_EDU_FO... Remove this comment to see the full error message
  PIX_EDU_FORMATION_INITIALE_AVANCE_PROFILE_DATA_OBJECTS_FOR_BUILDING_ANSWERS_AND_KNOWLEDGE_ELEMENTS,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'PIX_EDU_FO... Remove this comment to see the full error message
  PIX_EDU_FORMATION_CONTINUE_FORMATEUR_PROFILE_DATA_OBJECTS_FOR_BUILDING_ANSWERS_AND_KNOWLEDGE_ELEMENTS,
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
} = require('./certification-data');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'SCO_FOREIG... Remove this comment to see the full error message
const { SCO_FOREIGNER_USER_ID, SCO_FRENCH_USER_ID } = require('../organizations-sco-builder');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'certificat... Remove this comment to see the full error message
async function certificationUserProfilesBuilder({
  databaseBuilder
}: $TSFixMe) {
  const createdAt = new Date('2019-12-31T00:00:00Z');
  const updatedAt = createdAt;

  // STRONG Pix Profile
  await makeUserPixCertifiable({
    userId: CERTIF_SUCCESS_USER_ID,
    databaseBuilder,
    countCertifiableCompetences: 16,
    levelOnEachCompetence: 6,
  });
  await makeUserPixCertifiable({
    userId: CERTIF_FAILURE_USER_ID,
    databaseBuilder,
    countCertifiableCompetences: 16,
    levelOnEachCompetence: 6,
  });

  // Minimal Pix Profile
  await bluebird.mapSeries(
    [
      SCO_FRENCH_USER_ID,
      SCO_FOREIGNER_USER_ID,
      CERTIF_REGULAR_USER1_ID,
      CERTIF_REGULAR_USER2_ID,
      CERTIF_REGULAR_USER3_ID,
      CERTIF_REGULAR_USER4_ID,
      CERTIF_REGULAR_USER5_ID,
      CERTIF_SCO_STUDENT_ID,
    ],
    (userId: $TSFixMe) => {
      return makeUserPixCertifiable({
        userId,
        databaseBuilder,
        countCertifiableCompetences: 5,
        levelOnEachCompetence: 1,
      });
    },
  );

  // Pix+ Droit
  await makeUserPixCertifiable({
    userId: CERTIF_DROIT_USER5_ID,
    databaseBuilder,
    countCertifiableCompetences: 16,
    levelOnEachCompetence: 3,
  });
  await makeUserPixDroitCertifiable({ userId: CERTIF_DROIT_USER5_ID, databaseBuilder });

  // Minimal Pix Profile with timed challenge
  const assessmentId = databaseBuilder.factory.buildAssessment({
    userId: CERTIF_REGULAR_USER_WITH_TIMED_CHALLENGE_ID,
    type: 'COMPETENCE_EVALUATION',
    state: 'completed',
  }).id;
  _.each(
    WEAK_CERTIFIABLE_WITH_TIMED_CHALLENGE_PROFILE_DATA_OBJECTS_FOR_BUILDING_ANSWERS_AND_KNOWLEDGE_ELEMENTS,
    (data: $TSFixMe) => {
      const answerId = databaseBuilder.factory.buildAnswer({
        ...data,
        createdAt,
        updatedAt,
        assessmentId,
        value: 'Dummy value',
      }).id;
      databaseBuilder.factory.buildKnowledgeElement({
        ...data,
        createdAt,
        answerId,
        userId: CERTIF_REGULAR_USER_WITH_TIMED_CHALLENGE_ID,
        assessmentId,
      });
    },
  );

  // Pix+ EDU
  await makeUserPixCertifiable({
    userId: CERTIF_EDU_FORMATION_INITIALE_2ND_DEGRE_USER_ID,
    databaseBuilder,
    countCertifiableCompetences: 5,
    levelOnEachCompetence: 1,
  });
  const assessmentIdForPixEduFormationInitiale2ndDegre = databaseBuilder.factory.buildAssessment({
    userId: CERTIF_EDU_FORMATION_INITIALE_2ND_DEGRE_USER_ID,
    type: 'COMPETENCE_EVALUATION',
    state: 'completed',
  }).id;
  _.each(PIX_EDU_FORMATION_INITIALE_AVANCE_PROFILE_DATA_OBJECTS_FOR_BUILDING_ANSWERS_AND_KNOWLEDGE_ELEMENTS, (data: $TSFixMe) => {
    const answerId = databaseBuilder.factory.buildAnswer({
      ...data,
      createdAt,
      updatedAt,
      assessmentId: assessmentIdForPixEduFormationInitiale2ndDegre,
      value: 'Dummy value',
    }).id;
    databaseBuilder.factory.buildKnowledgeElement({
      ...data,
      createdAt,
      answerId,
      userId: CERTIF_EDU_FORMATION_INITIALE_2ND_DEGRE_USER_ID,
      assessmentId: assessmentIdForPixEduFormationInitiale2ndDegre,
    });
  });

  await makeUserPixCertifiable({
    userId: CERTIF_EDU_FORMATION_INITIALE_1ER_DEGRE_USER_ID,
    databaseBuilder,
    countCertifiableCompetences: 5,
    levelOnEachCompetence: 1,
  });
  const assessmentIdForPixEduFormationInitiale1erDegre = databaseBuilder.factory.buildAssessment({
    userId: CERTIF_EDU_FORMATION_INITIALE_1ER_DEGRE_USER_ID,
    type: 'COMPETENCE_EVALUATION',
    state: 'completed',
  }).id;
  _.each(PIX_EDU_FORMATION_INITIALE_AVANCE_PROFILE_DATA_OBJECTS_FOR_BUILDING_ANSWERS_AND_KNOWLEDGE_ELEMENTS, (data: $TSFixMe) => {
    const answerId = databaseBuilder.factory.buildAnswer({
      ...data,
      createdAt,
      updatedAt,
      assessmentId: assessmentIdForPixEduFormationInitiale1erDegre,
      value: 'Dummy value',
    }).id;
    databaseBuilder.factory.buildKnowledgeElement({
      ...data,
      createdAt,
      answerId,
      userId: CERTIF_EDU_FORMATION_INITIALE_1ER_DEGRE_USER_ID,
      assessmentId: assessmentIdForPixEduFormationInitiale1erDegre,
    });
  });

  await makeUserPixCertifiable({
    userId: CERTIF_EDU_FORMATION_CONTINUE_2ND_DEGRE_USER_ID,
    databaseBuilder,
    countCertifiableCompetences: 5,
    levelOnEachCompetence: 1,
  });
  const assessmentIdForPixEduFormationContinue2ndDegre = databaseBuilder.factory.buildAssessment({
    userId: CERTIF_EDU_FORMATION_CONTINUE_2ND_DEGRE_USER_ID,
    type: 'COMPETENCE_EVALUATION',
    state: 'completed',
  }).id;
  _.each(
    PIX_EDU_FORMATION_CONTINUE_FORMATEUR_PROFILE_DATA_OBJECTS_FOR_BUILDING_ANSWERS_AND_KNOWLEDGE_ELEMENTS,
    (data: $TSFixMe) => {
      const answerId = databaseBuilder.factory.buildAnswer({
        ...data,
        createdAt,
        updatedAt,
        assessmentId: assessmentIdForPixEduFormationContinue2ndDegre,
        value: 'Dummy value',
      }).id;
      databaseBuilder.factory.buildKnowledgeElement({
        ...data,
        createdAt,
        answerId,
        userId: CERTIF_EDU_FORMATION_CONTINUE_2ND_DEGRE_USER_ID,
        assessmentId: assessmentIdForPixEduFormationContinue2ndDegre,
      });
    },
  );

  await makeUserPixCertifiable({
    userId: CERTIF_EDU_FORMATION_CONTINUE_1ER_DEGRE_USER_ID,
    databaseBuilder,
    countCertifiableCompetences: 5,
    levelOnEachCompetence: 1,
  });
  const assessmentIdForPixEduFormationContinue1erDegre = databaseBuilder.factory.buildAssessment({
    userId: CERTIF_EDU_FORMATION_CONTINUE_1ER_DEGRE_USER_ID,
    type: 'COMPETENCE_EVALUATION',
    state: 'completed',
  }).id;
  _.each(
    PIX_EDU_FORMATION_CONTINUE_FORMATEUR_PROFILE_DATA_OBJECTS_FOR_BUILDING_ANSWERS_AND_KNOWLEDGE_ELEMENTS,
    (data: $TSFixMe) => {
      const answerId = databaseBuilder.factory.buildAnswer({
        ...data,
        createdAt,
        updatedAt,
        assessmentId: assessmentIdForPixEduFormationContinue1erDegre,
        value: 'Dummy value',
      }).id;
      databaseBuilder.factory.buildKnowledgeElement({
        ...data,
        createdAt,
        answerId,
        userId: CERTIF_EDU_FORMATION_CONTINUE_1ER_DEGRE_USER_ID,
        assessmentId: assessmentIdForPixEduFormationContinue1erDegre,
      });
    },
  );
}

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  certificationUserProfilesBuilder,
};
