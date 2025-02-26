const bluebird = require('bluebird');
const _ = require('lodash');
const OrganizationTag = require('../models/OrganizationTag');

module.exports = async function updateOrganizationInformation({
  organization,
  organizationForAdminRepository,
  organizationTagRepository,
  tagRepository,
}) {
  const existingOrganization = await organizationForAdminRepository.get(organization.id);
  await _updateOrganizationTags({
    organization,
    existingOrganization,
    organizationTagRepository,
    tagRepository,
  });

  if (organization.name) existingOrganization.name = organization.name;
  if (organization.type) existingOrganization.type = organization.type;
  if (organization.logoUrl) existingOrganization.logoUrl = organization.logoUrl;
  existingOrganization.email = organization.email;
  existingOrganization.credit = organization.credit;
  existingOrganization.externalId = organization.externalId;
  existingOrganization.provinceCode = organization.provinceCode;
  existingOrganization.isManagingStudents = organization.isManagingStudents;
  existingOrganization.documentationUrl = organization.documentationUrl;
  existingOrganization.showSkills = organization.showSkills;
  existingOrganization.identityProviderForCampaigns = organization.identityProviderForCampaigns;

  return organizationForAdminRepository.update(existingOrganization);
};

async function _updateOrganizationTags({
  organization,
  existingOrganization,
  organizationTagRepository,
  tagRepository,
}) {
  const tags = organization.tags;
  const existingTags = existingOrganization.tags;

  const tagsToAdd = _.differenceBy(tags, existingTags, 'id');
  const tagsToRemove = _.differenceBy(existingTags, tags, 'id');

  if (tagsToAdd.length > 0) {
    await bluebird.mapSeries(tagsToAdd, async (tag) => {
      await tagRepository.get(tag.id);

      const organizationTag = new OrganizationTag({ organizationId: existingOrganization.id, tagId: tag.id });
      await organizationTagRepository.create(organizationTag);
    });
  }

  if (tagsToRemove.length > 0) {
    await bluebird.mapSeries(tagsToRemove, async (tag) => {
      const organizationTag = await organizationTagRepository.findOneByOrganizationIdAndTagId({
        organizationId: organization.id,
        tagId: tag.id,
      });
      await organizationTagRepository.delete({ organizationTagId: organizationTag.id });
    });
  }
}
