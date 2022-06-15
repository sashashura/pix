const { ForbiddenError } = require('../http-errors');
const { ROLES } = require('../../domain/constants').PIX_ADMIN;
const allowedRoles = [ROLES.SUPER_ADMIN, ROLES.SUPPORT, ROLES.METIER];
const adminMemberRepositoryImplem = require('../../infrastructure/repositories/admin-member-repository');

async function isAllowed(request, adminMemberRepository = adminMemberRepositoryImplem) {
  const adminMember = await _getAdminMember(request.auth.credentials.userId, adminMemberRepository);
  if (allowedRoles.includes(adminMember.role)) {
    return true;
  }
  _denyAccess();
}

async function _getAdminMember(userId, adminMemberRepository) {
  try {
    return await adminMemberRepository.get({ userId });
  } catch (error) {
    _denyAccess();
  }
}

function _denyAccess() {
  throw new ForbiddenError('Missing or insufficient permissions.');
}

module.exports = { isAllowed };
