// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Organizati... Remove this comment to see the full error message
class OrganizationTag {
  id: $TSFixMe;
  organizationId: $TSFixMe;
  tagId: $TSFixMe;
  constructor({
    id,
    organizationId,
    tagId
  }: $TSFixMe = {}) {
    this.id = id;
    this.organizationId = organizationId;
    this.tagId = tagId;
  }
}

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = OrganizationTag;
