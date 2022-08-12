// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Assessment... Remove this comment to see the full error message
const Assessment = require('../../../../lib/domain/models/Assessment');

// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const buildAnswer = require('./build-answer');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const buildCourse = require('./build-course');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'buildKnowl... Remove this comment to see the full error message
const buildKnowledgeElement = require('./build-knowledge-element');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'buildTarge... Remove this comment to see the full error message
const buildTargetProfile = require('./build-target-profile');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'buildCampa... Remove this comment to see the full error message
const buildCampaignParticipation = require('./build-campaign-participation');

function buildAssessment({
  id = 123,
  courseId = 'courseId',
  certificationCourseId = null,
  createdAt = new Date('1992-06-12T01:02:03Z'),
  updatedAt = new Date('1992-06-12T01:02:03Z'),
  userId = 456,
  title = 'courseId',
  type = Assessment.types.CERTIFICATION,
  state = Assessment.states.COMPLETED,
  isImproving = false,
  course = buildCourse({ id: 'courseId' }),
  answers = [buildAnswer()],
  campaignParticipation = null,
  competenceId = null,
  lastQuestionDate = new Date('1992-06-12T01:02:03Z'),
  lastChallengeId = null,
  lastQuestionState = Assessment.statesOfLastQuestion.ASKED,
  method,
  campaignCode
}: $TSFixMe = {}) {
  return new Assessment({
    id,
    courseId,
    certificationCourseId,
    createdAt,
    updatedAt,
    userId,
    title,
    type,
    state,
    isImproving,
    competenceId,
    lastQuestionDate,
    lastChallengeId,
    lastQuestionState,
    answers,
    course,
    campaignParticipation,
    method,
    campaignCode,
  });
}

buildAssessment.ofTypeCampaign = function ({
  id = 123,
  courseId = 'courseId',
  createdAt = new Date('1992-06-12T01:02:03Z'),
  updatedAt = new Date('1992-06-12T01:02:03Z'),
  userId = 456,
  competenceId = null,
  state = Assessment.states.COMPLETED,
  isImproving = false,
  lastQuestionDate = new Date(),
  lastChallengeId = null,
  lastQuestionState = Assessment.statesOfLastQuestion.ASKED,
  answers = [buildAnswer()],
  course = buildCourse({ id: 'courseId' }),
  targetProfile = buildTargetProfile(),
  campaignParticipation = null,
  campaignParticipationId = null,
  title = 'campaignTitle',
  method,
  campaignCode
}: $TSFixMe = {}) {
  if (!_.isNil(campaignParticipation) && _.isNil(campaignParticipationId)) {
    campaignParticipationId = campaignParticipation.id;
  }
  if (_.isNil(campaignParticipation) && !_.isNil(campaignParticipationId)) {
    campaignParticipation = buildCampaignParticipation({ id: campaignParticipationId });
  }
  if (_.isNil(campaignParticipation) && _.isNil(campaignParticipationId)) {
    campaignParticipation = buildCampaignParticipation();
    campaignParticipationId = campaignParticipation.id;
  }

  return new Assessment({
    id,
    courseId,
    createdAt,
    updatedAt,
    userId,
    competenceId,
    title,
    type: Assessment.types.CAMPAIGN,
    state,
    isImproving,
    campaignParticipationId,
    lastQuestionDate,
    lastChallengeId,
    lastQuestionState,
    answers,
    course,
    targetProfile,
    campaignParticipation,
    method,
    campaignCode,
  });
};

buildAssessment.ofTypeCompetenceEvaluation = function ({
  id = 123,
  courseId = 'courseId',
  createdAt = new Date('1992-06-12T01:02:03Z'),
  updatedAt = new Date('1992-06-12T01:02:03Z'),
  userId = 456,
  state = Assessment.states.COMPLETED,
  title = 'Titre',
  isImproving = false,
  campaignParticipationId = null,
  lastQuestionDate = new Date(),
  lastChallengeId = null,
  lastQuestionState = Assessment.statesOfLastQuestion.ASKED,
  answers = [buildAnswer()],
  course = buildCourse({ id: 'courseId' }),
  targetProfile = buildTargetProfile(),
  knowledgeElements = [buildKnowledgeElement()],
  campaignParticipation = null,
  competenceId = 789,
} = {}) {
  return new Assessment({
    id,
    courseId,
    certificationCourseId: null,
    createdAt,
    updatedAt,
    userId,
    competenceId,
    campaignParticipationId,
    title,
    type: Assessment.types.COMPETENCE_EVALUATION,
    state,
    isImproving,
    lastQuestionDate,
    lastChallengeId,
    lastQuestionState,
    answers,
    course,
    targetProfile,
    knowledgeElements,
    campaignParticipation,
    campaignCode: null,
  });
};

buildAssessment.ofTypeCertification = buildAssessment;

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = buildAssessment;
