// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'NotFoundEr... Remove this comment to see the full error message
const { NotFoundError, MissingAttributesError } = require('../../domain/errors');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Organizati... Remove this comment to see the full error message
const OrganizationForAdmin = require('../../domain/models/OrganizationForAdmin');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Tag'.
const Tag = require('../../domain/models/Tag');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'knex'.
const { knex } = require('../../../db/knex-database-connection');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Organizati... Remove this comment to see the full error message
const OrganizationInvitation = require('../../domain/models/OrganizationInvitation');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable '_toDomain'... Remove this comment to see the full error message
function _toDomain(rawOrganization: $TSFixMe) {
  const organization = new OrganizationForAdmin({
    id: rawOrganization.id,
    name: rawOrganization.name,
    type: rawOrganization.type,
    logoUrl: rawOrganization.logoUrl,
    externalId: rawOrganization.externalId,
    provinceCode: rawOrganization.provinceCode,
    isManagingStudents: Boolean(rawOrganization.isManagingStudents),
    credit: rawOrganization.credit,
    email: rawOrganization.email,
    documentationUrl: rawOrganization.documentationUrl,
    createdBy: rawOrganization.createdBy,
    showNPS: rawOrganization.showNPS,
    formNPSUrl: rawOrganization.formNPSUrl,
    showSkills: rawOrganization.showSkills,
    archivedAt: rawOrganization.archivedAt,
    archivistFirstName: rawOrganization.archivistFirstName,
    archivistLastName: rawOrganization.archivistLastName,
    creatorFirstName: rawOrganization.creatorFirstName,
    creatorLastName: rawOrganization.creatorLastName,
  });

  organization.tags = rawOrganization.tags || [];

  return organization;
}

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  async get(id: $TSFixMe) {
    const organization = await knex('organizations')
      .select({
        id: 'organizations.id',
        name: 'organizations.name',
        type: 'organizations.type',
        logoUrl: 'organizations.logoUrl',
        externalId: 'organizations.externalId',
        provinceCode: 'organizations.provinceCode',
        isManagingStudents: 'organizations.isManagingStudents',
        credit: 'organizations.credit',
        email: 'organizations.email',
        documentationUrl: 'organizations.documentationUrl',
        createdBy: 'organizations.createdBy',
        showNPS: 'organizations.showNPS',
        formNPSUrl: 'organizations.formNPSUrl',
        showSkills: 'organizations.showSkills',
        archivedAt: 'organizations.archivedAt',
        archivistFirstName: 'archivists.firstName',
        archivistLastName: 'archivists.lastName',
        creatorFirstName: 'creators.firstName',
        creatorLastName: 'creators.lastName',
      })
      .leftJoin('users AS archivists', 'archivists.id', 'organizations.archivedBy')
      .leftJoin('users AS creators', 'creators.id', 'organizations.createdBy')
      .where('organizations.id', id)
      .first();

    if (!organization) {
      // @ts-expect-error TS(2554): Expected 3 arguments, but got 1.
      throw new NotFoundError(`Not found organization for ID ${id}`);
    }

    const tags = await knex('tags')
      .select('tags.*')
      .join('organization-tags', 'organization-tags.tagId', 'tags.id')
      .where('organization-tags.organizationId', organization.id);

    organization.tags = tags.map((tag: $TSFixMe) => {
      return new Tag(tag);
    });

    return _toDomain(organization);
  },

  async archive({
    id,
    archivedBy
  }: $TSFixMe) {
    if (!archivedBy) {
      throw new MissingAttributesError();
    }

    const archiveDate = new Date();

    await knex('organization-invitations')
      .where({ organizationId: id, status: OrganizationInvitation.StatusType.PENDING })
      .update({ status: OrganizationInvitation.StatusType.CANCELLED, updatedAt: archiveDate });

    await knex('campaigns').where({ organizationId: id, archivedAt: null }).update({ archivedAt: archiveDate });

    await knex('memberships').where({ organizationId: id, disabledAt: null }).update({ disabledAt: archiveDate });

    await knex('organizations')
      .where({ id: id, archivedBy: null })
      .update({ archivedBy: archivedBy, archivedAt: archiveDate });
  },
};
