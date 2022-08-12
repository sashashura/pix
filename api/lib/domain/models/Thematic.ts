// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Thematic'.
class Thematic {
  id: $TSFixMe;
  index: $TSFixMe;
  name: $TSFixMe;
  tubeIds: $TSFixMe;
  constructor({
    id,
    name,
    index,
    tubeIds = []
  }: $TSFixMe = {}) {
    this.id = id;
    this.name = name;
    this.index = index;
    this.tubeIds = tubeIds;
  }
}

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = Thematic;
