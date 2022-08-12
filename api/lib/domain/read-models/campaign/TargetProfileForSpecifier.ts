// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'TargetProf... Remove this comment to see the full error message
class TargetProfileForSpecifier {
  category: $TSFixMe;
  description: $TSFixMe;
  hasStage: $TSFixMe;
  id: $TSFixMe;
  name: $TSFixMe;
  thematicResultCount: $TSFixMe;
  tubeCount: $TSFixMe;
  constructor({
    id,
    name,
    skills,
    thematicResults,
    hasStage,
    description,
    category
  }: $TSFixMe) {
    this.id = id;
    this.name = name;
    this.tubeCount = _(skills).map('tubeId').uniq().size();
    this.thematicResultCount = thematicResults.length;
    this.hasStage = hasStage;
    this.description = description;
    this.category = category;
  }
}

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = TargetProfileForSpecifier;
