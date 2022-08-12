// @ts-expect-error TS(6200): Definitions of the following identifiers conflict ... Remove this comment to see the full error message
const tokenService = require('../../domain/services/token-service');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'usecases'.
const usecases = require('../../domain/usecases');

// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const campaignManagementSerializer = require('../../infrastructure/serializers/jsonapi/campaign-management-serializer');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'campaignRe... Remove this comment to see the full error message
const campaignReportSerializer = require('../../infrastructure/serializers/jsonapi/campaign-report-serializer');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'divisionSe... Remove this comment to see the full error message
const divisionSerializer = require('../../infrastructure/serializers/jsonapi/division-serializer');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'groupSeria... Remove this comment to see the full error message
const groupSerializer = require('../../infrastructure/serializers/jsonapi/group-serializer');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'membership... Remove this comment to see the full error message
const membershipSerializer = require('../../infrastructure/serializers/jsonapi/membership-serializer');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'organizati... Remove this comment to see the full error message
const organizationSerializer = require('../../infrastructure/serializers/jsonapi/organization-serializer');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'organizati... Remove this comment to see the full error message
const organizationInvitationSerializer = require('../../infrastructure/serializers/jsonapi/organization-invitation-serializer');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const userWithOrganizationLearnerSerializer = require('../../infrastructure/serializers/jsonapi/user-with-organization-learner-serializer');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const supOrganizationLearnerWarningSerializer = require('../../infrastructure/serializers/jsonapi/sup-organization-learner-warnings-serializer');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const organizationAttachTargetProfilesSerializer = require('../../infrastructure/serializers/jsonapi/organization-attach-target-profiles-serializer');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const TargetProfileForSpecifierSerializer = require('../../infrastructure/serializers/jsonapi/campaign/target-profile-for-specifier-serializer');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const organizationMemberIdentitySerializer = require('../../infrastructure/serializers/jsonapi/organization-member-identity-serializer');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const organizationPlacesLotManagmentSerializer = require('../../infrastructure/serializers/jsonapi/organization/organization-places-lot-management-serializer');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'organizati... Remove this comment to see the full error message
const organizationPlacesLotSerializer = require('../../infrastructure/serializers/jsonapi/organization/organization-places-lot-serializer');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const organizationPlacesCapacitySerializer = require('../../infrastructure/serializers/jsonapi/organization-places-capacity-serializer');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const organizationParticipantsSerializer = require('../../infrastructure/serializers/jsonapi/organization/organization-participants-serializer');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const scoOrganizationParticipantsSerializer = require('../../infrastructure/serializers/jsonapi/organization/sco-organization-participants-serializer');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const supOrganizationParticipantsSerializer = require('../../infrastructure/serializers/jsonapi/organization/sup-organization-participants-serializer');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'SupOrganiz... Remove this comment to see the full error message
const SupOrganizationLearnerParser = require('../../infrastructure/serializers/csv/sup-organization-learner-parser');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'queryParam... Remove this comment to see the full error message
const queryParamsUtils = require('../../infrastructure/utils/query-params-utils');
const {
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'extractLoc... Remove this comment to see the full error message
  extractLocaleFromRequest,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'extractUse... Remove this comment to see the full error message
  extractUserIdFromRequest,
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
} = require('../../infrastructure/utils/request-response-utils');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'moment'.
const moment = require('moment');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'certificat... Remove this comment to see the full error message
const certificationResultUtils = require('../../infrastructure/utils/csv/certification-results');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'certificat... Remove this comment to see the full error message
const certificationAttestationPdf = require('../../infrastructure/utils/pdf/certification-attestation-pdf');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const organizationForAdminSerializer = require('../../infrastructure/serializers/jsonapi/organization-for-admin-serializer');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  async getOrganizationDetails(request: $TSFixMe) {
    const organizationId = request.params.id;

    const organizationDetails = await usecases.getOrganizationDetails({ organizationId });
    return organizationForAdminSerializer.serialize(organizationDetails);
  },

  create: (request: $TSFixMe) => {
    const {
      name,
      type,
      email,
      'external-id': externalId,
      'province-code': provinceCode,
      'logo-url': logoUrl,
      'documentation-url': documentationUrl,
    } = request.payload.data.attributes;

    const superAdminUserId = extractUserIdFromRequest(request);
    return usecases
      .createOrganization({
        createdBy: superAdminUserId,
        name,
        type,
        externalId,
        provinceCode,
        logoUrl,
        email,
        documentationUrl,
      })
      .then(organizationSerializer.serialize);
  },

  async updateOrganizationInformation(request: $TSFixMe) {
    const organizationDeserialized = organizationSerializer.deserialize(request.payload);

    const organizationUpdated = await usecases.updateOrganizationInformation({
      organization: organizationDeserialized,
    });
    return organizationSerializer.serialize(organizationUpdated);
  },

  async findPaginatedFilteredOrganizations(request: $TSFixMe) {
    const options = queryParamsUtils.extractParameters(request.query);

    const { models: organizations, pagination } = await usecases.findPaginatedFilteredOrganizations({
      filter: options.filter,
      page: options.page,
    });
    return organizationSerializer.serialize(organizations, pagination);
  },

  async findPaginatedFilteredCampaigns(request: $TSFixMe) {
    const organizationId = request.params.id;
    const options = queryParamsUtils.extractParameters(request.query);
    const userId = request.auth.credentials.userId;

    if (options.filter.status === 'archived') {
      options.filter.ongoing = false;
      delete options.filter.status;
    }
    const { models: campaigns, meta } = await usecases.findPaginatedFilteredOrganizationCampaigns({
      organizationId,
      filter: options.filter,
      page: options.page,
      userId,
    });
    return campaignReportSerializer.serialize(campaigns, meta);
  },

  async findPaginatedCampaignManagements(request: $TSFixMe) {
    const organizationId = request.params.id;
    const { filter, page } = queryParamsUtils.extractParameters(request.query);

    const { models: campaigns, meta } = await usecases.findPaginatedCampaignManagements({
      organizationId,
      filter,
      page,
    });
    return campaignManagementSerializer.serialize(campaigns, meta);
  },

  async findPaginatedFilteredMemberships(request: $TSFixMe) {
    const organizationId = request.params.id;
    const options = queryParamsUtils.extractParameters(request.query);

    const { models: memberships, pagination } = await usecases.findPaginatedFilteredOrganizationMemberships({
      organizationId,
      filter: options.filter,
      page: options.page,
    });
    return membershipSerializer.serialize(memberships, pagination);
  },

  async getOrganizationMemberIdentities(request: $TSFixMe) {
    const organizationId = request.params.id;
    const members = await usecases.getOrganizationMemberIdentities({ organizationId });
    return organizationMemberIdentitySerializer.serialize(members);
  },

  async getOrganizationPlacesCapacity(request: $TSFixMe) {
    const organizationId = request.params.id;
    const organizationPlacesCapacity = await usecases.getOrganizationPlacesCapacity({ organizationId });
    return organizationPlacesCapacitySerializer.serialize(organizationPlacesCapacity);
  },

  async findOrganizationPlacesLot(request: $TSFixMe) {
    const organizationId = request.params.id;
    const places = await usecases.findOrganizationPlacesLot({ organizationId });
    return organizationPlacesLotManagmentSerializer.serialize(places);
  },

  async createOrganizationPlacesLot(request: $TSFixMe, h: $TSFixMe) {
    const organizationId = request.params.id;
    const createdBy = request.auth.credentials.userId;
    const organizationPlacesLotData = await organizationPlacesLotSerializer.deserialize(request.payload);
    const organizationPlacesLot = await usecases.createOrganizationPlacesLot({
      organizationPlacesLotData,
      organizationId,
      createdBy,
    });
    return h.response(organizationPlacesLotManagmentSerializer.serialize(organizationPlacesLot)).code(201);
  },

  async downloadCertificationAttestationsForDivision(request: $TSFixMe, h: $TSFixMe) {
    const organizationId = request.params.id;
    const { division, isFrenchDomainExtension } = request.query;

    const attestations = await usecases.findCertificationAttestationsForDivision({
      organizationId,
      division,
    });

    const { buffer } = await certificationAttestationPdf.getCertificationAttestationsPdfBuffer({
      certificates: attestations,
      isFrenchDomainExtension,
    });

    const now = moment();
    const fileName = `${now.format('YYYYMMDD')}_attestations_${division}.pdf`;

    return h
      .response(buffer)
      .header('Content-Disposition', `attachment; filename=${fileName}`)
      .header('Content-Type', 'application/pdf');
  },

  async downloadCertificationResults(request: $TSFixMe, h: $TSFixMe) {
    const organizationId = request.params.id;
    const { division } = request.query;

    const certificationResults = await usecases.getScoCertificationResultsByDivision({ organizationId, division });

    const csvResult = await certificationResultUtils.getDivisionCertificationResultsCsv({ certificationResults });

    const now = moment();
    const fileName = `${now.format('YYYYMMDD')}_resultats_${division}.csv`;

    return h
      .response(csvResult)
      .header('Content-Type', 'text/csv;charset=utf-8')
      .header('Content-Disposition', `attachment; filename="${fileName}"`);
  },

  async findTargetProfiles(request: $TSFixMe) {
    const organizationId = request.params.id;
    const targetProfiles = await usecases.getAvailableTargetProfilesForOrganization({ organizationId });
    return TargetProfileForSpecifierSerializer.serialize(targetProfiles);
  },

  async attachTargetProfiles(request: $TSFixMe, h: $TSFixMe) {
    const organizationId = request.params.id;
    const targetProfileIdsToAttach = request.payload.data.attributes['target-profiles-to-attach']
      // eslint-disable-next-line no-restricted-syntax
      .map((targetProfileToAttach: $TSFixMe) => parseInt(targetProfileToAttach));
    const results = await usecases.attachTargetProfilesToOrganization({
      organizationId,
      targetProfileIdsToAttach,
    });
    return h
      .response(organizationAttachTargetProfilesSerializer.serialize({ ...results, organizationId }))
      .code(results.attachedIds.length > 0 ? 201 : 200);
  },

  async getDivisions(request: $TSFixMe) {
    const organizationId = request.params.id;
    const divisions = await usecases.findDivisionsByOrganization({ organizationId });
    return divisionSerializer.serialize(divisions);
  },

  async getGroups(request: $TSFixMe) {
    const organizationId = request.params.id;
    const groups = await usecases.findGroupsByOrganization({ organizationId });
    return groupSerializer.serialize(groups);
  },

  async findPaginatedFilteredOrganizationLearners(request: $TSFixMe, h: $TSFixMe) {
    const organizationId = request.params.id;
    const { filter, page } = queryParamsUtils.extractParameters(request.query);
    if (filter.divisions && !Array.isArray(filter.divisions)) {
      filter.divisions = [filter.divisions];
    }

    if (filter.groups && !Array.isArray(filter.groups)) {
      filter.groups = [filter.groups];
    }
    const { data, pagination } = await usecases.findPaginatedFilteredOrganizationLearners({
      organizationId,
      filter,
      page,
    });
    return h
      .response(userWithOrganizationLearnerSerializer.serialize(data, pagination))
      .header('Deprecation', 'true')
      .header(
        'Link',
        `/api/organizations/${request.params.id}/sco-participants or /api/organizations/${request.params.id}/sup-participants; rel="successor-version"`
      );
  },

  async findPaginatedFilteredScoParticipants(request: $TSFixMe) {
    const organizationId = request.params.id;
    const { filter, page } = queryParamsUtils.extractParameters(request.query);
    if (filter.divisions && !Array.isArray(filter.divisions)) {
      filter.divisions = [filter.divisions];
    }

    const { data: scoOrganizationParticipants, pagination } = await usecases.findPaginatedFilteredScoParticipants({
      organizationId,
      filter,
      page,
    });
    return scoOrganizationParticipantsSerializer.serialize({ scoOrganizationParticipants, pagination });
  },

  async findPaginatedFilteredSupParticipants(request: $TSFixMe) {
    const organizationId = request.params.id;
    const { filter, page } = queryParamsUtils.extractParameters(request.query);
    if (filter.groups && !Array.isArray(filter.groups)) {
      filter.groups = [filter.groups];
    }

    const { data: supOrganizationParticipants, pagination } = await usecases.findPaginatedFilteredSupParticipants({
      organizationId,
      filter,
      page,
    });
    return supOrganizationParticipantsSerializer.serialize({ supOrganizationParticipants, pagination });
  },

  async importOrganizationLearnersFromSIECLE(request: $TSFixMe, h: $TSFixMe) {
    const organizationId = request.params.id;
    const { format } = request.query;

    await usecases.importOrganizationLearnersFromSIECLEFormat({
      organizationId,
      payload: request.payload,
      format,
      i18n: request.i18n,
    });

    const response = h.response(null).code(204);
    if (h.request.path === `/api/organizations/${request.params.id}/schooling-registrations/import-siecle`) {
      response
        .header('Deprecation', 'true')
        .header(
          'Link',
          `/api/organizations/${request.params.id}/sco-organization-learners/import-siecle; rel="successor-version"`
        );
    }
    return response;
  },

  async importSupOrganizationLearners(request: $TSFixMe, h: $TSFixMe) {
    const organizationId = request.params.id;
    const buffer = request.payload;
    const supOrganizationLearnerParser = new SupOrganizationLearnerParser(buffer, organizationId, request.i18n);
    const warnings = await usecases.importSupOrganizationLearners({ supOrganizationLearnerParser });

    const response = h
      .response(supOrganizationLearnerWarningSerializer.serialize({ id: organizationId, warnings }))
      .code(200);
    if (h.request.path === `/api/organizations/${request.params.id}/schooling-registrations/import-csv`) {
      response
        .header('Deprecation', 'true')
        .header(
          'Link',
          `/api/organizations/${request.params.id}/sup-organization-learners/import-csv; rel="successor-version"`
        );
    }
    return response;
  },

  async replaceSupOrganizationLearners(request: $TSFixMe, h: $TSFixMe) {
    const organizationId = request.params.id;
    const buffer = request.payload;
    const supOrganizationLearnerParser = new SupOrganizationLearnerParser(buffer, organizationId, request.i18n);
    const warnings = await usecases.replaceSupOrganizationLearners({
      organizationId,
      supOrganizationLearnerParser,
    });

    const response = h
      .response(supOrganizationLearnerWarningSerializer.serialize({ id: organizationId, warnings }))
      .code(200);
    if (h.request.path === `/api/organizations/${request.params.id}/schooling-registrations/replace-csv`) {
      response
        .header('Deprecation', 'true')
        .header(
          'Link',
          `/api/organizations/${request.params.id}/sup-organization-learners/replace-csv; rel="successor-version"`
        );
    }
    return response;
  },

  async sendInvitations(request: $TSFixMe, h: $TSFixMe) {
    const organizationId = request.params.id;
    const emails = request.payload.data.attributes.email.split(',');
    const locale = extractLocaleFromRequest(request);

    const organizationInvitations = await usecases.createOrganizationInvitations({ organizationId, emails, locale });
    return h.response(organizationInvitationSerializer.serialize(organizationInvitations)).created();
  },

  async cancelOrganizationInvitation(request: $TSFixMe, h: $TSFixMe) {
    const organizationInvitationId = request.params.organizationInvitationId;
    await usecases.cancelOrganizationInvitation({ organizationInvitationId });
    return h.response().code(204);
  },

  async sendInvitationByLangAndRole(request: $TSFixMe, h: $TSFixMe) {
    const organizationId = request.params.id;
    const invitationInformation =
      await organizationInvitationSerializer.deserializeForCreateOrganizationInvitationAndSendEmail(request.payload);

    const organizationInvitation = await usecases.createOrganizationInvitationByAdmin({
      organizationId,
      email: invitationInformation.email,
      locale: invitationInformation.lang,
      role: invitationInformation.role,
    });
    return h.response(organizationInvitationSerializer.serialize(organizationInvitation)).created();
  },

  findPendingInvitations(request: $TSFixMe) {
    const organizationId = request.params.id;

    return usecases
      .findPendingOrganizationInvitations({ organizationId })
      .then((invitations: $TSFixMe) => organizationInvitationSerializer.serialize(invitations));
  },

  async getOrganizationLearnersCsvTemplate(request: $TSFixMe, h: $TSFixMe) {
    const organizationId = request.params.id;
    const token = request.query.accessToken;
    const userId = tokenService.extractUserId(token);
    const template = await usecases.getOrganizationLearnersCsvTemplate({
      userId,
      organizationId,
      i18n: request.i18n,
    });

    const response = h
      .response(template)
      .header('Content-Type', 'text/csv;charset=utf-8')
      .header('Content-Disposition', `attachment; filename=${request.i18n.__('csv-template.template-name')}.csv`);
    if (h.request.path === `/api/organizations/${request.params.id}/schooling-registrations/csv-template`) {
      response
        .header('Deprecation', 'true')
        .header(
          'Link',
          `/api/organizations/${request.params.id}/sup-organization-learners/csv-template; rel="successor-version"`
        );
    }
    return response;
  },

  async archiveOrganization(request: $TSFixMe) {
    const organizationId = request.params.id;
    const userId = extractUserIdFromRequest(request);
    const archivedOrganization = await usecases.archiveOrganization({ organizationId, userId });
    return organizationForAdminSerializer.serialize(archivedOrganization);
  },

  async getPaginatedParticipantsForAnOrganization(request: $TSFixMe) {
    const organizationId = request.params.id;
    const options = queryParamsUtils.extractParameters(request.query);
    const results = await usecases.getPaginatedParticipantsForAnOrganization({
      organizationId,
      page: options.page,
      filters: options.filter,
    });
    return organizationParticipantsSerializer.serialize(results);
  },
};
