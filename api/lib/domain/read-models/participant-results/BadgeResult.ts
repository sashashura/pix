// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'SkillSetRe... Remove this comment to see the full error message
const SkillSetResult = require('./SkillSetResult');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'BadgeResul... Remove this comment to see the full error message
class BadgeResult {
  altMessage: $TSFixMe;
  id: $TSFixMe;
  imageUrl: $TSFixMe;
  isAcquired: $TSFixMe;
  isAlwaysVisible: $TSFixMe;
  key: $TSFixMe;
  message: $TSFixMe;
  skillSetResults: $TSFixMe;
  title: $TSFixMe;
  constructor(badge: $TSFixMe, participationResults: $TSFixMe) {
    const { acquiredBadgeIds, knowledgeElements } = participationResults;
    this.id = badge.id;
    this.title = badge.title;
    this.message = badge.message;
    this.altMessage = badge.altMessage;
    this.key = badge.key;
    this.imageUrl = badge.imageUrl;
    this.isAcquired = acquiredBadgeIds.includes(badge.id);
    this.isAlwaysVisible = badge.isAlwaysVisible;

    this.skillSetResults = badge.badgeCompetences.map((competence: $TSFixMe) => _buildCompetenceResults(competence, knowledgeElements)
    );
  }
}

function _buildCompetenceResults(badgeCompetence: $TSFixMe, knowledgeElements: $TSFixMe) {
  const skillIds = badgeCompetence.skillIds;
  const competenceKnowledgeElements = knowledgeElements.filter(({
    skillId
  }: $TSFixMe) => skillIds.includes(skillId));

  return new SkillSetResult(badgeCompetence, competenceKnowledgeElements);
}

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = BadgeResult;
