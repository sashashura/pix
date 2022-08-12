// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'SkillSetRe... Remove this comment to see the full error message
class SkillSetResult {
  id: $TSFixMe;
  masteryPercentage: $TSFixMe;
  name: $TSFixMe;
  testedSkillsCount: $TSFixMe;
  totalSkillsCount: $TSFixMe;
  validatedSkillsCount: $TSFixMe;
  constructor(competence: $TSFixMe, knowledgeElements: $TSFixMe) {
    const totalSkillsCount = competence.skillIds.length;
    const validatedSkillsCount = knowledgeElements.filter(({
      isValidated
    }: $TSFixMe) => isValidated).length;

    this.id = competence.id;
    this.name = competence.name;
    this.totalSkillsCount = totalSkillsCount;
    this.testedSkillsCount = knowledgeElements.length;
    this.validatedSkillsCount = validatedSkillsCount;
    this.masteryPercentage = Math.round((validatedSkillsCount / totalSkillsCount) * 100);
  }
}

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = SkillSetResult;
