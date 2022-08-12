/* eslint-disable  no-restricted-syntax */
// @ts-expect-error TS(6200): Definitions of the following identifiers conflict ... Remove this comment to see the full error message
const bluebird = require('bluebird');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const checkAdminMemberHasRoleSuperAdminUseCase = require('./usecases/checkAdminMemberHasRoleSuperAdmin');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const checkAdminMemberHasRoleCertifUseCase = require('./usecases/checkAdminMemberHasRoleCertif');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const checkAdminMemberHasRoleSupportUseCase = require('./usecases/checkAdminMemberHasRoleSupport');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const checkAdminMemberHasRoleMetierUseCase = require('./usecases/checkAdminMemberHasRoleMetier');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const checkUserIsAdminInOrganizationUseCase = require('./usecases/checkUserIsAdminInOrganization');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const checkUserBelongsToOrganizationManagingStudentsUseCase = require('./usecases/checkUserBelongsToOrganizationManagingStudents');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const checkUserBelongsToScoOrganizationAndManagesStudentsUseCase = require('./usecases/checkUserBelongsToScoOrganizationAndManagesStudents');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const checkUserBelongsToSupOrganizationAndManagesStudentsUseCase = require('./usecases/checkUserBelongsToSupOrganizationAndManagesStudents');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const checkUserOwnsCertificationCourseUseCase = require('./usecases/checkUserOwnsCertificationCourse');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const checkUserBelongsToOrganizationUseCase = require('./usecases/checkUserBelongsToOrganization');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'checkUserI... Remove this comment to see the full error message
const checkUserIsAdminAndManagingStudentsForOrganization = require('./usecases/checkUserIsAdminAndManagingStudentsForOrganization');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const checkUserIsMemberOfAnOrganizationUseCase = require('./usecases/checkUserIsMemberOfAnOrganization');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const checkUserIsMemberOfCertificationCenterUsecase = require('./usecases/checkUserIsMemberOfCertificationCenter');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const checkUserIsMemberOfCertificationCenterSessionUsecase = require('./usecases/checkUserIsMemberOfCertificationCenterSession');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const checkAuthorizationToManageCampaignUsecase = require('./usecases/checkAuthorizationToManageCampaign');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'certificat... Remove this comment to see the full error message
const certificationIssueReportRepository = require('../infrastructure/repositories/certification-issue-report-repository');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Organizati... Remove this comment to see the full error message
const Organization = require('../../lib/domain/models/Organization');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'ForbiddenA... Remove this comment to see the full error message
const { ForbiddenAccess } = require('../..//lib/domain/errors');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'apps'.
const apps = require('../..//lib/domain/constants');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'JSONAPIErr... Remove this comment to see the full error message
const JSONAPIError = require('jsonapi-serializer').Error;
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'has'.
const has = require('lodash/has');

function _replyForbiddenError(h: $TSFixMe) {
  const errorHttpStatusCode = 403;

  const jsonApiError = new JSONAPIError({
    code: errorHttpStatusCode,
    title: 'Forbidden access',
    detail: 'Missing or insufficient permissions.',
  });

  return h.response(jsonApiError).code(errorHttpStatusCode).takeover();
}

async function checkAdminMemberHasRoleSuperAdmin(request: $TSFixMe, h: $TSFixMe) {
  if (!request.auth.credentials || !request.auth.credentials.userId) {
    return _replyForbiddenError(h);
  }

  const userId = request.auth.credentials.userId;

  try {
    const hasRoleSuperAdmin = await checkAdminMemberHasRoleSuperAdminUseCase.execute(userId);
    if (!hasRoleSuperAdmin) {
      throw new ForbiddenAccess(apps.PIX_ADMIN.NOT_ALLOWED_MSG);
    }
    return h.response(true);
  } catch (e) {
    return _replyForbiddenError(h);
  }
}

async function checkAdminMemberHasRoleCertif(request: $TSFixMe, h: $TSFixMe) {
  if (!request.auth.credentials || !request.auth.credentials.userId) {
    return _replyForbiddenError(h);
  }

  const userId = request.auth.credentials.userId;

  try {
    const hasRoleCertif = await checkAdminMemberHasRoleCertifUseCase.execute(userId);
    if (!hasRoleCertif) {
      throw new ForbiddenAccess(apps.PIX_ADMIN.NOT_ALLOWED_MSG);
    }
    return h.response(true);
  } catch (e) {
    return _replyForbiddenError(h);
  }
}

async function checkAdminMemberHasRoleSupport(request: $TSFixMe, h: $TSFixMe) {
  if (!request.auth.credentials || !request.auth.credentials.userId) {
    return _replyForbiddenError(h);
  }

  const userId = request.auth.credentials.userId;

  try {
    const hasRoleSupport = await checkAdminMemberHasRoleSupportUseCase.execute(userId);
    if (!hasRoleSupport) {
      throw new ForbiddenAccess(apps.PIX_ADMIN.NOT_ALLOWED_MSG);
    }
    return h.response(true);
  } catch (e) {
    return _replyForbiddenError(h);
  }
}

async function checkAdminMemberHasRoleMetier(request: $TSFixMe, h: $TSFixMe) {
  if (!request.auth.credentials || !request.auth.credentials.userId) {
    return _replyForbiddenError(h);
  }

  const userId = request.auth.credentials.userId;

  try {
    const hasRoleMetier = await checkAdminMemberHasRoleMetierUseCase.execute(userId);
    if (!hasRoleMetier) {
      throw new ForbiddenAccess(apps.PIX_ADMIN.NOT_ALLOWED_MSG);
    }
    return h.response(true);
  } catch (e) {
    return _replyForbiddenError(h);
  }
}

function checkRequestedUserIsAuthenticatedUser(request: $TSFixMe, h: $TSFixMe) {
  if (!request.auth.credentials || !request.auth.credentials.userId) {
    return _replyForbiddenError(h);
  }

  const authenticatedUserId = request.auth.credentials.userId;
  const requestedUserId = parseInt(request.params.userId) || parseInt(request.params.id);

  return authenticatedUserId === requestedUserId ? h.response(true) : _replyForbiddenError(h);
}

function checkUserIsAdminInOrganization(request: $TSFixMe, h: $TSFixMe) {
  if (!request.auth.credentials || !request.auth.credentials.userId) {
    return _replyForbiddenError(h);
  }

  const userId = request.auth.credentials.userId;

  //organizationId can be retrieved from path param in case organizations/id/invitations api or from memberships payload in case memberships/id
  const organizationId =
    request.path && request.path.includes('memberships')
      ? request.payload.data.relationships.organization.data.id
      : parseInt(request.params.id);

  return checkUserIsAdminInOrganizationUseCase
    .execute(userId, organizationId)
    .then((isAdminInOrganization: $TSFixMe) => {
      if (isAdminInOrganization) {
        return h.response(true);
      }
      return _replyForbiddenError(h);
    })
    .catch(() => _replyForbiddenError(h));
}

function checkUserIsMemberOfCertificationCenter(request: $TSFixMe, h: $TSFixMe) {
  if (!request.auth.credentials || !request.auth.credentials.userId) {
    return _replyForbiddenError(h);
  }

  const userId = request.auth.credentials.userId;
  const certificationCenterId = parseInt(request.params.certificationCenterId);

  return checkUserIsMemberOfCertificationCenterUsecase
    .execute(userId, certificationCenterId)
    .then((isMemberInCertificationCenter: $TSFixMe) => {
      if (isMemberInCertificationCenter) {
        return h.response(true);
      }
      return _replyForbiddenError(h);
    })
    .catch(() => _replyForbiddenError(h));
}

async function checkUserIsMemberOfCertificationCenterSessionFromCertificationIssueReportId(request: $TSFixMe, h: $TSFixMe) {
  if (!request.auth.credentials || !request.auth.credentials.userId) {
    return _replyForbiddenError(h);
  }

  const userId = request.auth.credentials.userId;
  const certificationIssueReportId = parseInt(request.params.id);

  try {
    const certificationIssueReport = await certificationIssueReportRepository.get(certificationIssueReportId);
    const isMemberOfSession = await checkUserIsMemberOfCertificationCenterSessionUsecase.execute({
      userId,
      certificationCourseId: certificationIssueReport.certificationCourseId,
    });
    return isMemberOfSession ? h.response(true) : _replyForbiddenError(h);
  } catch (e) {
    return _replyForbiddenError(h);
  }
}

async function checkUserIsMemberOfCertificationCenterSessionFromCertificationCourseId(request: $TSFixMe, h: $TSFixMe) {
  if (!request.auth.credentials || !request.auth.credentials.userId) {
    return _replyForbiddenError(h);
  }

  const userId = request.auth.credentials.userId;
  const certificationCourseId = parseInt(request.params.id);

  try {
    const isMemberOfSession = await checkUserIsMemberOfCertificationCenterSessionUsecase.execute({
      userId,
      certificationCourseId,
    });
    return isMemberOfSession ? h.response(true) : _replyForbiddenError(h);
  } catch (e) {
    return _replyForbiddenError(h);
  }
}

async function checkUserBelongsToOrganizationManagingStudents(request: $TSFixMe, h: $TSFixMe) {
  if (!has(request, 'auth.credentials.userId')) {
    return _replyForbiddenError(h);
  }

  const userId = request.auth.credentials.userId;
  const organizationId = parseInt(request.params.id);

  try {
    if (await checkUserBelongsToOrganizationManagingStudentsUseCase.execute(userId, organizationId)) {
      return h.response(true);
    }
  } catch (err) {
    return _replyForbiddenError(h);
  }
  return _replyForbiddenError(h);
}

async function checkUserBelongsToScoOrganizationAndManagesStudents(request: $TSFixMe, h: $TSFixMe) {
  if (!request.auth.credentials || !request.auth.credentials.userId) {
    return _replyForbiddenError(h);
  }

  const userId = request.auth.credentials.userId;
  const organizationId = parseInt(request.params.id) || parseInt(request.payload.data.attributes['organization-id']);

  let belongsToScoOrganizationAndManageStudents;
  try {
    belongsToScoOrganizationAndManageStudents =
      await checkUserBelongsToScoOrganizationAndManagesStudentsUseCase.execute(userId, organizationId);
  } catch (err) {
    return _replyForbiddenError(h);
  }

  if (belongsToScoOrganizationAndManageStudents) {
    return h.response(true);
  }

  return _replyForbiddenError(h);
}

async function checkUserBelongsToSupOrganizationAndManagesStudents(request: $TSFixMe, h: $TSFixMe) {
  if (!request.auth.credentials || !request.auth.credentials.userId) {
    return _replyForbiddenError(h);
  }

  const userId = request.auth.credentials.userId;
  const organizationId = parseInt(request.params.id) || parseInt(request.payload.data.attributes['organization-id']);

  let belongsToSupOrganizationAndManageStudents;
  try {
    belongsToSupOrganizationAndManageStudents =
      await checkUserBelongsToSupOrganizationAndManagesStudentsUseCase.execute(userId, organizationId);
  } catch (err) {
    return _replyForbiddenError(h);
  }

  if (belongsToSupOrganizationAndManageStudents) {
    return h.response(true);
  }

  return _replyForbiddenError(h);
}

async function checkUserIsAdminInSCOOrganizationManagingStudents(request: $TSFixMe, h: $TSFixMe) {
  const userId = request.auth.credentials.userId;
  const organizationId = parseInt(request.params.id);

  if (
    await checkUserIsAdminAndManagingStudentsForOrganization.execute(userId, organizationId, Organization.types.SCO)
  ) {
    return h.response(true);
  }
  return _replyForbiddenError(h);
}

async function checkUserIsAdminInSUPOrganizationManagingStudents(request: $TSFixMe, h: $TSFixMe) {
  const userId = request.auth.credentials.userId;
  const organizationId = parseInt(request.params.id);

  if (
    await checkUserIsAdminAndManagingStudentsForOrganization.execute(userId, organizationId, Organization.types.SUP)
  ) {
    return h.response(true);
  }

  return _replyForbiddenError(h);
}

async function checkUserBelongsToOrganization(request: $TSFixMe, h: $TSFixMe) {
  if (!request.auth.credentials || !request.auth.credentials.userId) {
    return _replyForbiddenError(h);
  }

  const userId = request.auth.credentials.userId;
  const organizationId = parseInt(request.params.id);

  const belongsToOrganization = await checkUserBelongsToOrganizationUseCase.execute(userId, organizationId);
  if (belongsToOrganization) {
    return h.response(true);
  }
  return _replyForbiddenError(h);
}

async function checkUserIsMemberOfAnOrganization(request: $TSFixMe, h: $TSFixMe) {
  if (!request.auth.credentials || !request.auth.credentials.userId) {
    return _replyForbiddenError(h);
  }

  const userId = request.auth.credentials.userId;

  let isMemberOfAnOrganization;
  try {
    isMemberOfAnOrganization = await checkUserIsMemberOfAnOrganizationUseCase.execute(userId);
  } catch (err) {
    return _replyForbiddenError(h);
  }

  if (isMemberOfAnOrganization) {
    return h.response(true);
  }
  return _replyForbiddenError(h);
}

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'checkAutho... Remove this comment to see the full error message
async function checkAuthorizationToManageCampaign(request: $TSFixMe, h: $TSFixMe) {
  const userId = request.auth.credentials.userId;
  const campaignId = request.params.id;
  const isAdminOrOwnerOfTheCampaign = await checkAuthorizationToManageCampaignUsecase.execute({
    userId,
    campaignId,
  });

  if (isAdminOrOwnerOfTheCampaign) return h.response(true);
  return _replyForbiddenError(h);
}

function adminMemberHasAtLeastOneAccessOf(securityChecks: $TSFixMe) {
  return async (request: $TSFixMe, h: $TSFixMe) => {
    const responses = await bluebird.map(securityChecks, (securityCheck: $TSFixMe) => securityCheck(request, h));
    const hasAccess = responses.some((response: $TSFixMe) => !response.source?.errors);
    return hasAccess ? hasAccess : _replyForbiddenError(h);
  };
}

async function checkUserOwnsCertificationCourse(request: $TSFixMe, h: $TSFixMe) {
  if (!request.auth.credentials || !request.auth.credentials.userId) {
    return _replyForbiddenError(h);
  }

  const userId = request.auth.credentials.userId;
  const certificationCourseId = parseInt(request.params.id);

  try {
    const ownsCertificationCourse = await checkUserOwnsCertificationCourseUseCase.execute({
      userId,
      certificationCourseId,
    });
    return ownsCertificationCourse ? h.response(true) : _replyForbiddenError(h);
  } catch (e) {
    return _replyForbiddenError(h);
  }
}

/* eslint-enable no-restricted-syntax */

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  checkRequestedUserIsAuthenticatedUser,
  checkUserBelongsToOrganizationManagingStudents,
  checkUserBelongsToScoOrganizationAndManagesStudents,
  checkUserBelongsToSupOrganizationAndManagesStudents,
  checkAdminMemberHasRoleSuperAdmin,
  checkAdminMemberHasRoleCertif,
  checkAdminMemberHasRoleSupport,
  checkAdminMemberHasRoleMetier,
  checkUserIsAdminInOrganization,
  checkAuthorizationToManageCampaign,
  checkUserIsAdminInSCOOrganizationManagingStudents,
  checkUserIsAdminInSUPOrganizationManagingStudents,
  checkUserBelongsToOrganization,
  checkUserIsMemberOfAnOrganization,
  checkUserIsMemberOfCertificationCenter,
  checkUserOwnsCertificationCourse,
  checkUserIsMemberOfCertificationCenterSessionFromCertificationCourseId,
  checkUserIsMemberOfCertificationCenterSessionFromCertificationIssueReportId,
  adminMemberHasAtLeastOneAccessOf,
};
