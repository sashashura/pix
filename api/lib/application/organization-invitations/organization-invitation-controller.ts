// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'MissingQue... Remove this comment to see the full error message
const { MissingQueryParamError } = require('../http-errors');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'usecases'.
const usecases = require('../../domain/usecases');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'organizati... Remove this comment to see the full error message
const organizationInvitationSerializer = require('../../infrastructure/serializers/jsonapi/organization-invitation-serializer');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'scoOrganiz... Remove this comment to see the full error message
const scoOrganizationInvitationSerializer = require('../../infrastructure/serializers/jsonapi/sco-organization-invitation-serializer');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'extractLoc... Remove this comment to see the full error message
const { extractLocaleFromRequest } = require('../../infrastructure/utils/request-response-utils');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  async acceptOrganizationInvitation(request: $TSFixMe) {
    const organizationInvitationId = request.params.id;
    const { code, email } = request.payload.data.attributes;

    const membership = await usecases.acceptOrganizationInvitation({ organizationInvitationId, code, email });
    await usecases.createCertificationCenterMembershipForScoOrganizationMember({ membership });
    return null;
  },

  async sendScoInvitation(request: $TSFixMe, h: $TSFixMe) {
    const { uai, 'first-name': firstName, 'last-name': lastName } = request.payload.data.attributes;

    const locale = extractLocaleFromRequest(request);

    const organizationScoInvitation = await usecases.sendScoInvitation({ uai, firstName, lastName, locale });

    return h.response(scoOrganizationInvitationSerializer.serialize(organizationScoInvitation)).created();
  },

  async getOrganizationInvitation(request: $TSFixMe) {
    const organizationInvitationId = request.params.id;
    const organizationInvitationCode = request.query.code;

    if (_.isEmpty(organizationInvitationCode)) {
      throw new MissingQueryParamError('code');
    }

    const organizationInvitation = await usecases.getOrganizationInvitation({
      organizationInvitationId,
      organizationInvitationCode,
    });
    return organizationInvitationSerializer.serialize(organizationInvitation);
  },
};
