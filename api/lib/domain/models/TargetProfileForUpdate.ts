// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'validate'.
const { validate } = require('../validators/target-profile/base-validation');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'TargetProf... Remove this comment to see the full error message
class TargetProfileForUpdate {
  category: $TSFixMe;
  comment: $TSFixMe;
  description: $TSFixMe;
  id: $TSFixMe;
  name: $TSFixMe;
  constructor({
    id,
    name,
    description,
    comment,
    category
  }: $TSFixMe) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.comment = comment;
    this.category = category;
  }

  update({
    name,
    description,
    comment,
    category
  }: $TSFixMe) {
    this.name = name;
    this.description = description;
    this.comment = comment;
    this.category = category;
    validate(this);
  }
}

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = TargetProfileForUpdate;
