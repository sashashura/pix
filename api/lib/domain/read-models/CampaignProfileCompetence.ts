// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'CampaignPr... Remove this comment to see the full error message
class CampaignProfileCompetence {
  areaColor: $TSFixMe;
  estimatedLevel: $TSFixMe;
  id: $TSFixMe;
  index: $TSFixMe;
  name: $TSFixMe;
  pixScore: $TSFixMe;
  constructor({
    id,
    index,
    name,
    pixScore,
    estimatedLevel,
    area
  }: $TSFixMe = {}) {
    this.id = id;
    this.index = index;
    this.name = name;
    this.pixScore = pixScore;
    this.estimatedLevel = estimatedLevel;
    this.areaColor = area && area.color;
  }
}

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = CampaignProfileCompetence;
