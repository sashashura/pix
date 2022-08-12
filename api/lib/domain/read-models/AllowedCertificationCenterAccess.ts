// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'features'.
const { features } = require('../../config');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'AllowedCer... Remove this comment to see the full error message
class AllowedCertificationCenterAccess {
  externalId: $TSFixMe;
  habilitations: $TSFixMe;
  id: $TSFixMe;
  isRelatedToManagingStudentsOrganization: $TSFixMe;
  isSupervisorAccessEnabled: $TSFixMe;
  name: $TSFixMe;
  relatedOrganizationTags: $TSFixMe;
  type: $TSFixMe;
  constructor({
    id,
    name,
    externalId,
    type,
    isRelatedToManagingStudentsOrganization,
    relatedOrganizationTags,
    habilitations,
    isSupervisorAccessEnabled
  }: $TSFixMe) {
    this.id = id;
    this.name = name;
    this.externalId = externalId;
    this.type = type;
    this.isRelatedToManagingStudentsOrganization = isRelatedToManagingStudentsOrganization;
    this.relatedOrganizationTags = relatedOrganizationTags;
    this.habilitations = habilitations;
    this.isSupervisorAccessEnabled = isSupervisorAccessEnabled;
  }

  isAccessBlockedCollege() {
    return (
      this.isCollege() &&
      !this.isLycee() &&
      !this.isInWhitelist() &&
      new Date() < new Date(features.pixCertifScoBlockedAccessDateCollege)
    );
  }

  isAccessBlockedLycee() {
    return (
      this.isLycee() && !this.isInWhitelist() && new Date() < new Date(features.pixCertifScoBlockedAccessDateLycee)
    );
  }

  isAccessBlockedAEFE() {
    return this.isAEFE() && !this.isInWhitelist() && new Date() < new Date(features.pixCertifScoBlockedAccessDateLycee);
  }

  isAccessBlockedAgri() {
    return this.isAgri() && !this.isInWhitelist() && new Date() < new Date(features.pixCertifScoBlockedAccessDateLycee);
  }

  hasTag(tagName: $TSFixMe) {
    return this.relatedOrganizationTags.includes(tagName);
  }

  isCollege() {
    return this.isScoManagingStudents() && this.hasTag('COLLEGE');
  }

  isLycee() {
    return this.isScoManagingStudents() && (this.hasTag('LYCEE') || this.hasTag('LYCEE PRO'));
  }

  isAEFE() {
    return this.hasTag('AEFE');
  }

  isAgri() {
    return this.isScoManagingStudents() && this.hasTag('AGRICULTURE');
  }

  isScoManagingStudents() {
    return this.type === 'SCO' && this.isRelatedToManagingStudentsOrganization;
  }

  isInWhitelist() {
    return features.pixCertifScoBlockedAccessWhitelist.includes(this.externalId.toUpperCase());
  }

  isEndTestScreenRemovalEnabled() {
    return this.isSupervisorAccessEnabled;
  }

  get pixCertifScoBlockedAccessDateLycee() {
    return features.pixCertifScoBlockedAccessDateLycee ?? null;
  }

  get pixCertifScoBlockedAccessDateCollege() {
    return features.pixCertifScoBlockedAccessDateCollege ?? null;
  }
}

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = AllowedCertificationCenterAccess;
