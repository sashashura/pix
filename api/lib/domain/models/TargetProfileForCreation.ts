// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'validate'.
const { validate } = require('../validators/target-profile/creation-validation');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'TargetProf... Remove this comment to see the full error message
const TargetProfile = require('./TargetProfile');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'DEFAULT_IM... Remove this comment to see the full error message
const DEFAULT_IMAGE_URL = 'https://images.pix.fr/profil-cible/Illu_GEN.svg';

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'TargetProf... Remove this comment to see the full error message
class TargetProfileForCreation {
  category: $TSFixMe;
  comment: $TSFixMe;
  description: $TSFixMe;
  imageUrl: $TSFixMe;
  isPublic: $TSFixMe;
  name: $TSFixMe;
  ownerOrganizationId: $TSFixMe;
  skillIds: $TSFixMe;
  tubes: $TSFixMe;
  constructor({
    name,
    category = TargetProfile.categories.OTHER,
    skillIds,
    description,
    comment,
    isPublic,
    imageUrl,
    ownerOrganizationId,
    tubes
  }: $TSFixMe) {
    this.name = name;
    this.category = category;
    this.skillIds = skillIds;
    this.description = description;
    this.comment = comment;
    this.isPublic = isPublic;
    this.imageUrl = imageUrl || DEFAULT_IMAGE_URL;
    this.ownerOrganizationId = ownerOrganizationId;
    this.tubes = tubes;
    validate(this);
  }
}

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = TargetProfileForCreation;
