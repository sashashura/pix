// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'TargetedCo... Remove this comment to see the full error message
class TargetedCompetence {
  areaId: $TSFixMe;
  id: $TSFixMe;
  index: $TSFixMe;
  name: $TSFixMe;
  origin: $TSFixMe;
  thematics: $TSFixMe;
  tubes: $TSFixMe;
  constructor({
    id,
    name,
    index,
    origin,
    areaId,
    tubes = [],
    thematics = []
  }: $TSFixMe = {}) {
    this.id = id;
    this.name = name;
    this.index = index;
    this.origin = origin;
    this.areaId = areaId;
    this.tubes = tubes;
    this.thematics = thematics;
  }

  get skillCount() {
    return _.sumBy(this.tubes, (tube: $TSFixMe) => tube.skills.length);
  }
}

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = TargetedCompetence;
