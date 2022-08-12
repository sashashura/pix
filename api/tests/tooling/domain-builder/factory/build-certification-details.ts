// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Certificat... Remove this comment to see the full error message
const CertificationDetails = require('../../../../lib/domain/read-models/CertificationDetails');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'states'.
const { states } = require('../../../../lib/domain/models/CertificationAssessment');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = function buildCertificationDetails({
  id = 123,
  userId = 456,
  createdAt = new Date('2020-01-01'),
  completedAt = new Date('2020-03-03'),
  status = states.COMPLETED,
  totalScore = 555,
  percentageCorrectAnswers = 75,
  competencesWithMark = [
    {
      areaCode: '1',
      id: 'recComp1',
      index: '1.1',
      name: 'manger des fruits',
      obtainedLevel: 1,
      obtainedScore: 9,
      positionedLevel: 2,
      positionedScore: 17,
    },
  ],
  listChallengesAndAnswers = [
    {
      challengeId: 'recChal1',
      competence: '1.1',
      result: 'ok',
      skill: 'manger une mangue',
      value: 'miam',
    },
  ],
} = {}) {
  return new CertificationDetails({
    id,
    userId,
    createdAt,
    completedAt,
    status,
    totalScore,
    percentageCorrectAnswers,
    competencesWithMark,
    listChallengesAndAnswers,
  });
};
