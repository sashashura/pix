// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Tag'.
const Tag = require('./Tag');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'types'.
const types = {
  SCO: 'SCO',
  SUP: 'SUP',
  PRO: 'PRO',
};

const defaultValues = {
  credit: 0,
};

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Organizati... Remove this comment to see the full error message
class Organization {
  static types = types;

  static defaultValues = defaultValues;

  archivedAt: $TSFixMe;
  createdBy: $TSFixMe;
  credit: $TSFixMe;
  documentationUrl: $TSFixMe;
  email: $TSFixMe;
  externalId: $TSFixMe;
  formNPSUrl: $TSFixMe;
  id: $TSFixMe;
  isManagingStudents: $TSFixMe;
  logoUrl: $TSFixMe;
  name: $TSFixMe;
  organizationInvitations: $TSFixMe;
  provinceCode: $TSFixMe;
  showNPS: $TSFixMe;
  showSkills: $TSFixMe;
  students: $TSFixMe;
  tags: $TSFixMe;
  targetProfileShares: $TSFixMe;
  type: $TSFixMe;

  constructor({
    id,
    name,
    type,
    logoUrl,
    externalId,
    provinceCode,
    isManagingStudents,
    credit = defaultValues.credit,
    email,
    targetProfileShares = [],
    students = [],
    organizationInvitations = [],
    tags = [],
    documentationUrl,
    createdBy,
    showNPS,
    formNPSUrl,
    showSkills,
    archivedAt
  }: $TSFixMe = {}) {
    this.id = id;
    this.name = name;
    this.type = type;
    this.logoUrl = logoUrl;
    this.externalId = externalId;
    this.provinceCode = provinceCode;
    this.isManagingStudents = isManagingStudents;
    this.credit = credit;
    this.email = email;
    this.targetProfileShares = targetProfileShares;
    this.students = students;
    this.organizationInvitations = organizationInvitations;
    this.tags = tags;
    this.documentationUrl = documentationUrl;
    this.createdBy = createdBy;
    this.showNPS = showNPS;
    this.formNPSUrl = formNPSUrl;
    this.showSkills = showSkills;
    this.archivedAt = archivedAt;
  }

  get isSup() {
    return this.type === types.SUP;
  }

  get isSco() {
    return this.type === types.SCO;
  }

  get isPro() {
    return this.type === types.PRO;
  }

  get isAgriculture() {
    return Boolean(this.tags.find((tag: $TSFixMe) => this.isSco && tag.name === Tag.AGRICULTURE));
  }

  get isPoleEmploi() {
    return Boolean(this.tags.find((tag: $TSFixMe) => tag.name === Tag.POLE_EMPLOI));
  }

  get isScoAndManagingStudents() {
    return this.isSco && this.isManagingStudents;
  }

  get isScoAndHasExternalId() {
    return this.isSco && Boolean(this.externalId);
  }

  get isArchived() {
    return this.archivedAt !== null;
  }
}
// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = Organization;
