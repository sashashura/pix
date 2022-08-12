// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'KnowledgeE... Remove this comment to see the full error message
const KnowledgeElement = require('../../../../lib/domain/models/KnowledgeElement');

const buildKnowledgeElement = function ({
  id = 123,
  source = KnowledgeElement.SourceType.DIRECT,
  status = KnowledgeElement.StatusType.VALIDATED,
  earnedPix = 4,
  createdAt,
  answerId = 456,
  assessmentId = 789,
  skillId = 'recSKIL123',
  userId = 159,
  competenceId = 'recCOMP456'
}: $TSFixMe = {}) {
  const correctEarnedPix = status === KnowledgeElement.StatusType.VALIDATED ? earnedPix : 0;
  return new KnowledgeElement({
    id,
    source,
    status,
    earnedPix: correctEarnedPix,
    createdAt,
    answerId,
    assessmentId,
    skillId,
    userId,
    competenceId,
  });
};

buildKnowledgeElement.directlyValidated = function ({
  id = 123,
  earnedPix = 4,
  createdAt,
  answerId = 456,
  assessmentId = 789,
  skillId = 'recSKIL123',
  userId = 159,
  competenceId = 'recCOMP456'
}: $TSFixMe = {}) {
  return new KnowledgeElement({
    id,
    source: KnowledgeElement.SourceType.DIRECT,
    status: KnowledgeElement.StatusType.VALIDATED,
    earnedPix,
    createdAt,
    answerId,
    assessmentId,
    skillId,
    userId,
    competenceId,
  });
};

buildKnowledgeElement.directlyInvalidated = function ({
  id = 123,
  createdAt,
  answerId = 456,
  assessmentId = 789,
  skillId = 'recSKIL123',
  userId = 159,
  competenceId = 'recCOMP456'
}: $TSFixMe = {}) {
  return new KnowledgeElement({
    id,
    source: KnowledgeElement.SourceType.DIRECT,
    status: KnowledgeElement.StatusType.INVALIDATED,
    earnedPix: 0,
    createdAt,
    answerId,
    assessmentId,
    skillId,
    userId,
    competenceId,
  });
};

buildKnowledgeElement.inferredValidated = function ({
  id = 123,
  earnedPix = 4,
  createdAt,
  answerId = 456,
  assessmentId = 789,
  skillId = 'recSKIL123',
  userId = 159,
  competenceId = 'recCOMP456'
}: $TSFixMe = {}) {
  return new KnowledgeElement({
    id,
    source: KnowledgeElement.SourceType.INFERRED,
    status: KnowledgeElement.StatusType.VALIDATED,
    earnedPix,
    createdAt,
    answerId,
    assessmentId,
    skillId,
    userId,
    competenceId,
  });
};

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = buildKnowledgeElement;
