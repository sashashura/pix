// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Competence... Remove this comment to see the full error message
class CompetenceResult {
  areaColor: $TSFixMe;
  areaName: $TSFixMe;
  id: $TSFixMe;
  index: $TSFixMe;
  name: $TSFixMe;
  testedSkillsCount: $TSFixMe;
  totalSkillsCount: $TSFixMe;
  validatedSkillsCount: $TSFixMe;
  constructor({
    id,
    name,
    index,
    areaColor,
    areaName,
    totalSkillsCount,
    testedSkillsCount,
    validatedSkillsCount
  }: $TSFixMe = {}) {
    this.id = id;
    this.name = name;
    this.index = index;
    this.areaColor = areaColor;
    this.areaName = areaName;
    this.totalSkillsCount = totalSkillsCount;
    this.testedSkillsCount = testedSkillsCount;
    this.validatedSkillsCount = validatedSkillsCount;
  }

  get masteryPercentage() {
    if (this.totalSkillsCount !== 0) {
      return Math.round((this.validatedSkillsCount * 100) / this.totalSkillsCount);
    } else {
      return 0;
    }
  }
}

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = CompetenceResult;
