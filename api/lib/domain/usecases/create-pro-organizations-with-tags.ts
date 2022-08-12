// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'isEmpty'.
const { isEmpty, map, uniqBy } = require('lodash');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'bluebird'.
const bluebird = require('bluebird');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Organizati... Remove this comment to see the full error message
const Organization = require('../models/Organization');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Organizati... Remove this comment to see the full error message
const OrganizationTag = require('../models/OrganizationTag');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'organizati... Remove this comment to see the full error message
const organizationValidator = require('../validators/organization-with-tags-script');

const {
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'ManyOrgani... Remove this comment to see the full error message
  ManyOrganizationsFoundError,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Organizati... Remove this comment to see the full error message
  OrganizationAlreadyExistError,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Organizati... Remove this comment to see the full error message
  OrganizationTagNotFound,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'ObjectVali... Remove this comment to see the full error message
  ObjectValidationError,
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
} = require('../errors');

const ORGANIZATION_TAG_SEPARATOR = '_';
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'organizati... Remove this comment to see the full error message
const organizationInvitationService = require('../../domain/services/organization-invitation-service');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = async function createProOrganizationsWithTags({
  organizations,
  domainTransaction,
  organizationRepository,
  tagRepository,
  organizationTagRepository,
  organizationInvitationRepository
}: $TSFixMe) {
  _checkIfOrganizationsDataAreNotEmpty(organizations);
  _checkIfOrganizationsDataAreUnique(organizations);

  for (const organization of organizations) {
    organizationValidator.validate(organization);
  }

  await _checkIfOrganizationsAlreadyExistInDatabase(organizations, organizationRepository);

  const organizationsData = _mapOrganizationsData(organizations);

  const allTags = await tagRepository.findAll();

  let createdOrganizations = null;

  await domainTransaction.execute(async (domainTransaction: $TSFixMe) => {
    const organizationsToCreate = Array.from(organizationsData.values()).map((data) => {
      // eslint-disable-next-line no-unused-vars
      const { email, ...organization } = data.organization;
      return organization;
    });

    createdOrganizations = await organizationRepository.batchCreateProOrganizations(
      organizationsToCreate,
      domainTransaction
    );

    const organizationsTags = createdOrganizations.flatMap(({
      id,
      externalId,
      name
    }: $TSFixMe) => {
      return organizationsData.get(externalId).tags.map((tagName: $TSFixMe) => {
        const foundTag = allTags.find((tagInDB: $TSFixMe) => tagInDB.name === tagName.toUpperCase());
        if (foundTag) {
          return new OrganizationTag({ organizationId: id, tagId: foundTag.id });
        } else {
          throw new OrganizationTagNotFound(`Le tag ${tagName} de l'organisation ${name} n'existe pas.`);
        }
      });
    });

    await organizationTagRepository.batchCreate(organizationsTags, domainTransaction);
  });

  // @ts-expect-error TS(2531): Object is possibly 'null'.
  const createdOrganizationsWithEmail = createdOrganizations
    .map(({
    id,
    externalId,
    name
  }: $TSFixMe) => {
      const { organization } = organizationsData.get(externalId);
      return {
        email: organization?.email,
        externalId,
        id,
        name,
      };
    })
    .filter((organization: $TSFixMe) => !!organization.email);

  await bluebird.mapSeries(createdOrganizationsWithEmail, (organization: $TSFixMe) => {
    const { locale, organizationInvitationRole } = organizationsData.get(organization.externalId);
    return organizationInvitationService.createProOrganizationInvitation({
      organizationRepository,
      organizationInvitationRepository,
      organizationId: organization.id,
      name: organization.name,
      email: organization.email,
      role: organizationInvitationRole?.toUpperCase(),
      locale,
    });
  });

  return createdOrganizations;
};

function _checkIfOrganizationsDataAreUnique(organizations: $TSFixMe) {
  const uniqOrganizations = uniqBy(organizations, 'externalId');

  if (uniqOrganizations.length !== organizations.length) {
    throw new ManyOrganizationsFoundError('Une organisation apparaît plusieurs fois.');
  }
}

async function _checkIfOrganizationsAlreadyExistInDatabase(organizations: $TSFixMe, organizationRepository: $TSFixMe) {
  const foundOrganizations = await organizationRepository.findByExternalIdsFetchingIdsOnly(
    map(organizations, 'externalId')
  );

  if (!isEmpty(foundOrganizations)) {
    const foundOrganizationIds = foundOrganizations.map((foundOrganization: $TSFixMe) => foundOrganization.externalId);
    const message = `Les organisations avec les externalIds suivants : ${foundOrganizationIds.join(
      ', '
    )} existent déjà.`;
    throw new OrganizationAlreadyExistError(message);
  }
}

function _checkIfOrganizationsDataAreNotEmpty(organizations: $TSFixMe) {
  if (isEmpty(organizations)) {
    throw new ObjectValidationError('Les organisations ne sont pas renseignées.');
  }
}
function _mapOrganizationsData(organizations: $TSFixMe) {
  const mapOrganizationByExternalId = new Map();

  for (const organization of organizations) {
    mapOrganizationByExternalId.set(organization.externalId, {
      organization: new Organization({
        ...organization,
        type: Organization.types.PRO,
      }),
      tags: organization.tags.split(ORGANIZATION_TAG_SEPARATOR),
      organizationInvitationRole: organization.organizationInvitationRole,
      locale: organization.locale,
    });
  }

  return mapOrganizationByExternalId;
}
