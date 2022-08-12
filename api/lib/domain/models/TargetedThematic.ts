// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = class TargetedThematic {
  id: $TSFixMe;
  index: $TSFixMe;
  name: $TSFixMe;
  tubes: $TSFixMe;
  constructor({
    id,
    name,
    index,
    tubes = []
  }: $TSFixMe = {}) {
    this.id = id;
    this.name = name;
    this.index = index;
    this.tubes = tubes;
  }
};
