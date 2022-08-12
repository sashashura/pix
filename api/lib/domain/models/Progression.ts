// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');
const PROGRESSION_ID_PREFIX = 'progression-';

const ONE_HUNDRED_PERCENT = 1;

/*
 * Traduction : Profil d'avancement
 */
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Progressio... Remove this comment to see the full error message
class Progression {
  id: $TSFixMe;
  isProfileCompleted: $TSFixMe;
  knowledgeElements: $TSFixMe;
  targetedKnowledgeElements: $TSFixMe;
  targetedSkills: $TSFixMe;
  targetedSkillsIds: $TSFixMe;
  constructor({
    id,
    targetedSkills = [],
    knowledgeElements = [],
    isProfileCompleted = false
  }: $TSFixMe) {
    this.id = id;
    this.knowledgeElements = knowledgeElements;
    this.targetedSkills = targetedSkills;
    this.targetedSkillsIds = _.map(targetedSkills, 'id');
    this.targetedKnowledgeElements = _.filter(knowledgeElements, (ke: $TSFixMe) => _.includes(this.targetedSkillsIds, ke.skillId)
    );
    this.isProfileCompleted = isProfileCompleted;
  }

  _getTargetedSkillsAlreadyTestedCount() {
    return this.targetedKnowledgeElements.length;
  }

  _getTargetedSkillsCount() {
    return this.targetedSkillsIds.length;
  }

  get completionRate() {
    return this.isProfileCompleted
      ? ONE_HUNDRED_PERCENT
      : this._getTargetedSkillsAlreadyTestedCount() / this._getTargetedSkillsCount();
  }

  static generateIdFromAssessmentId(assessmentId: $TSFixMe) {
    return `${PROGRESSION_ID_PREFIX}${assessmentId}`;
  }

  static getAssessmentIdFromId(progressionId: $TSFixMe) {
    return parseInt(progressionId.replace(PROGRESSION_ID_PREFIX, ''), 10);
  }
}

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = Progression;
