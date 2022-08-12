// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'buildAnswe... Remove this comment to see the full error message
const buildAnswer = require('./build-answer');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'buildAsses... Remove this comment to see the full error message
const buildAssessment = require('./build-assessment');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'buildUser'... Remove this comment to see the full error message
const buildUser = require('./build-user');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'databaseBu... Remove this comment to see the full error message
const databaseBuffer = require('../database-buffer');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'KnowledgeE... Remove this comment to see the full error message
const KnowledgeElement = require('../../../lib/domain/models/KnowledgeElement');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = function buildKnowledgeElement({
  id = databaseBuffer.getNextId(),
  source = KnowledgeElement.SourceType.DIRECT,
  status = KnowledgeElement.StatusType.VALIDATED,
  createdAt = new Date('2020-01-01'),
  earnedPix = 2,
  skillId = 'recABC123',
  assessmentId,
  answerId,
  userId,
  competenceId = 'recCHA789'
}: $TSFixMe = {}) {
  userId = _.isUndefined(userId) ? buildUser().id : userId;
  assessmentId = _.isUndefined(assessmentId) ? buildAssessment({ userId }).id : assessmentId;
  answerId = _.isUndefined(answerId) ? buildAnswer({ assessmentId }).id : answerId;

  const correctEarnedPix = status === KnowledgeElement.StatusType.VALIDATED ? earnedPix : 0;
  const values = {
    id,
    source,
    status,
    createdAt,
    earnedPix: correctEarnedPix,
    skillId,
    assessmentId,
    answerId,
    userId,
    competenceId,
  };
  return databaseBuffer.pushInsertable({
    tableName: 'knowledge-elements',
    values,
  });
};
