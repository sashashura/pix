const { expect, catchErr, sinon, domainBuilder } = require('../../../test-helper');
const { isAllowed } = require('../../../../lib/application/campaigns/admin-update-campaign-access');
const { ROLES } = require('../../../../lib/domain/constants').PIX_ADMIN;
const { ForbiddenError } = require('../../../../lib/application/http-errors');
const { NotFoundError } = require('../../../../lib/domain/errors');

describe('PATCH /api/admin/campaigns/{id} access', function () {
  let adminMemberRepository;
  beforeEach(function () {
    adminMemberRepository = { get: sinon.stub() };
  });

  it('get the user from the credentials', async function () {
    const request = { auth: { credentials: { userId: 2 } } };

    const adminMember = domainBuilder.buildAdminMember({ role: ROLES.SUPER_ADMIN });
    adminMemberRepository.get.resolves(adminMember);

    await isAllowed(request, adminMemberRepository);

    expect(adminMemberRepository.get).to.have.been.calledWith({ userId: 2 });
  });

  it('return true when the user has the role super admin', async function () {
    const request = { auth: { credentials: { userId: 2 } } };

    const adminMember = domainBuilder.buildAdminMember({ role: ROLES.SUPER_ADMIN });
    adminMemberRepository.get.resolves(adminMember);

    expect(await isAllowed(request, adminMemberRepository)).to.equal(true);
  });

  it('return true when the user has no pix admin roles', async function () {
    const request = { auth: { credentials: { userId: 2 } } };
    adminMemberRepository.get.rejects(new NotFoundError());

    const error = await catchErr(isAllowed)(request, adminMemberRepository);

    expect(error).to.be.an.instanceOf(ForbiddenError);
    expect(error.status).to.equal(403);
    expect(error.title).to.equal('Forbidden');
    expect(error.message).to.equal('Missing or insufficient permissions.');
  });

  it('throws an exception when the user has not an allowed role', async function () {
    const request = { auth: { credentials: { userId: 2 } } };
    const adminMember = domainBuilder.buildAdminMember({ role: ROLES.CERTIF });

    adminMemberRepository.get.resolves(adminMember);

    const error = await catchErr(isAllowed)(request, adminMemberRepository);

    expect(error).to.be.an.instanceOf(ForbiddenError);
    expect(error.status).to.equal(403);
    expect(error.title).to.equal('Forbidden');
    expect(error.message).to.equal('Missing or insufficient permissions.');
  });

  it('throws an exception when the user is not allowed', async function () {
    const request = { auth: { credentials: { userId: 2 } } };
    const adminMember = domainBuilder.buildAdminMember({ role: ROLES.CERTIF });

    adminMemberRepository.get.resolves(adminMember);

    const error = await catchErr(isAllowed)(request, adminMemberRepository);

    expect(error).to.be.an.instanceOf(ForbiddenError);
    expect(error.status).to.equal(403);
    expect(error.title).to.equal('Forbidden');
    expect(error.message).to.equal('Missing or insufficient permissions.');
  });

  it('return true when the user has the role support', async function () {
    const request = { auth: { credentials: { userId: 2 } } };

    const adminMember = domainBuilder.buildAdminMember({ role: ROLES.SUPPORT });
    adminMemberRepository.get.resolves(adminMember);

    expect(await isAllowed(request, adminMemberRepository)).to.equal(true);
  });

  it('return true when the user has the role metier', async function () {
    const request = { auth: { credentials: { userId: 2 } } };

    const adminMember = domainBuilder.buildAdminMember({ role: ROLES.METIER });
    adminMemberRepository.get.resolves(adminMember);

    expect(await isAllowed(request, adminMemberRepository)).to.equal(true);
  });
});
