const legitimateUsages = [
  { identifier: 'public.campaign-participations.participantExternalId', rule: 'missing-foreign-key' },
  { identifier: 'public.certification-candidates.externalId', rule: 'missing-foreign-key' },
  { identifier: 'public.certification-centers.externalId', rule: 'missing-foreign-key' },
  { identifier: 'public.certification-challenges.challengeId', rule: 'missing-foreign-key' },
  { identifier: 'public.certification-courses.externalId', rule: 'missing-foreign-key' },
  { identifier: 'public.organizations.externalId', rule: 'missing-foreign-key' },
  { identifier: 'public.schooling-registrations.nationalStudentId', rule: 'missing-foreign-key' },
];

const uncheckedUsages = [
  { identifier: 'public.answers.challengeIds', rule: 'missing-foreign-key' },
  { identifier: 'public.assessments.courseId ', rule: 'missing-foreign-key' },
  { identifier: 'public.assessments.competenceId', rule: 'missing-foreign-key' },
  { identifier: 'public.assessments.lastChallengeId ', rule: 'missing-foreign-key' },
  { identifier: 'public.answers.challengeIds', rule: 'missing-foreign-key' },
  { identifier: 'public.certification-challenges.competenceId', rule: 'missing-foreign-key' },
  { identifier: 'public.certification-challenges.associatedSkillId ', rule: 'missing-foreign-key' },
  { identifier: 'public.competence-evaluations.competenceId', rule: 'missing-foreign-key' },
  { identifier: 'public.competence-marks.competenceId', rule: 'missing-foreign-key' },
  { identifier: 'public.feedbacks.challengeId', rule: 'missing-foreign-key' },
  { identifier: 'public.finalized-sessions.sessionId', rule: 'missing-foreign-key' },
  { identifier: 'public.knowledge-element-snapshots.userId ', rule: 'missing-foreign-key' },
  { identifier: 'public.knowledge-elements.skillId', rule: 'missing-foreign-key' },
  { identifier: 'public.knowledge-element-snapshots.competenceId ', rule: 'missing-foreign-key' },
  { identifier: 'public.knowledge-element-snapshots.userId', rule: 'missing-foreign-key' },
  { identifier: 'public.target-profiles_skills.skillId', rule: 'missing-foreign-key' },
  { identifier: 'public.tutorial-evaluations.userId', rule: 'missing-foreign-key' },
  { identifier: 'public.tutorial-evaluations.tutorialId', rule: 'missing-foreign-key' },
  { identifier: 'public.user_tutorials.userId', rule: 'missing-foreign-key' },
  { identifier: 'public.user_tutorials.tutorialId', rule: 'missing-foreign-key' },
];

const exceptions = [...legitimateUsages, ...uncheckedUsages];

module.exports = exceptions;
