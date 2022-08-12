// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Organizati... Remove this comment to see the full error message
class OrganizationForAdmin {
  archivedAt: $TSFixMe;
  archivistFirstName: $TSFixMe;
  archivistLastName: $TSFixMe;
  createdBy: $TSFixMe;
  creatorFirstName: $TSFixMe;
  creatorLastName: $TSFixMe;
  credit: $TSFixMe;
  documentationUrl: $TSFixMe;
  email: $TSFixMe;
  externalId: $TSFixMe;
  formNPSUrl: $TSFixMe;
  id: $TSFixMe;
  isManagingStudents: $TSFixMe;
  logoUrl: $TSFixMe;
  name: $TSFixMe;
  provinceCode: $TSFixMe;
  showNPS: $TSFixMe;
  showSkills: $TSFixMe;
  tags: $TSFixMe;
  type: $TSFixMe;
  constructor({
    id,
    name,
    type,
    logoUrl,
    externalId,
    provinceCode,
    isManagingStudents,
    credit,
    email,
    documentationUrl,
    createdBy,
    showNPS,
    formNPSUrl,
    showSkills,
    archivedAt,
    archivistFirstName,
    archivistLastName,
    creatorFirstName,
    creatorLastName,
    tags = []
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
    this.documentationUrl = documentationUrl;
    this.createdBy = createdBy;
    this.showNPS = showNPS;
    this.formNPSUrl = formNPSUrl;
    this.showSkills = showSkills;
    this.archivedAt = archivedAt;
    this.archivistFirstName = archivistFirstName;
    this.archivistLastName = archivistLastName;
    this.creatorFirstName = creatorFirstName;
    this.creatorLastName = creatorLastName;
    this.tags = tags;
  }

  get archivistFullName() {
    return this.archivistFirstName && this.archivistLastName
      ? `${this.archivistFirstName} ${this.archivistLastName}`
      : null;
  }

  get creatorFullName() {
    return this.creatorFirstName && this.creatorLastName ? `${this.creatorFirstName} ${this.creatorLastName}` : null;
  }
}

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = OrganizationForAdmin;
