// @ts-expect-error TS(6200): Definitions of the following identifiers conflict ... Remove this comment to see the full error message
const { expect, sinon, hFake, domainBuilder } = require('../../test-helper');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'securityPr... Remove this comment to see the full error message
const securityPreHandlers = require('../../../lib/application/security-pre-handlers');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'tokenServi... Remove this comment to see the full error message
const tokenService = require('../../../lib/domain/services/token-service');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const checkAdminMemberHasRoleSuperAdminUseCase = require('../../../lib/application/usecases/checkAdminMemberHasRoleSuperAdmin');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const checkAdminMemberHasRoleCertifUseCase = require('../../../lib/application/usecases/checkAdminMemberHasRoleCertif');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const checkAdminMemberHasRoleSupportUseCase = require('../../../lib/application/usecases/checkAdminMemberHasRoleSupport');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const checkAdminMemberHasRoleMetierUseCase = require('../../../lib/application/usecases/checkAdminMemberHasRoleMetier');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const checkUserIsAdminInOrganizationUseCase = require('../../../lib/application/usecases/checkUserIsAdminInOrganization');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const checkUserBelongsToOrganizationManagingStudentsUseCase = require('../../../lib/application/usecases/checkUserBelongsToOrganizationManagingStudents');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const checkUserBelongsToScoOrganizationAndManagesStudentsUseCase = require('../../../lib/application/usecases/checkUserBelongsToScoOrganizationAndManagesStudents');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const checkUserIsMemberOfAnOrganizationUseCase = require('../../../lib/application/usecases/checkUserIsMemberOfAnOrganization');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const checkUserIsMemberOfCertificationCenterUseCase = require('../../../lib/application/usecases/checkUserIsMemberOfCertificationCenter');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const checkAuthorizationToManageCampaignUsecase = require('../../../lib/application/usecases/checkAuthorizationToManageCampaign');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const checkUserIsMemberOfCertificationCenterSessionUsecase = require('../../../lib/application/usecases/checkUserIsMemberOfCertificationCenterSession');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const certificationIssueReportRepository = require('../../../lib/infrastructure/repositories/certification-issue-report-repository');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const checkUserOwnsCertificationCourseUseCase = require('../../../lib/application/usecases/checkUserOwnsCertificationCourse');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Application | SecurityPreHandlers', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#checkAdminMemberHasRoleSuperAdmin', function () {
    let hasRoleSuperAdminStub: $TSFixMe;
    let request: $TSFixMe;

    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(function () {
      sinon.stub(tokenService, 'extractTokenFromAuthChain');
      hasRoleSuperAdminStub = sinon.stub(checkAdminMemberHasRoleSuperAdminUseCase, 'execute');
      request = { auth: { credentials: { accessToken: 'valid.access.token', userId: 1234 } } };
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('Successful case', function () {
      // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
      beforeEach(function () {
        hasRoleSuperAdminStub.resolves({ user_id: 1234 });
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should authorize access to resource when the user is authenticated and has role Super Admin', async function () {
        // given

        // when
        const response = await securityPreHandlers.checkAdminMemberHasRoleSuperAdmin(request, hFake);

        // then
        expect(response.source).to.equal(true);
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('Error cases', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should forbid resource access when user was not previously authenticated', async function () {
        // given
        delete request.auth.credentials;

        // when
        const response = await securityPreHandlers.checkAdminMemberHasRoleSuperAdmin(request, hFake);

        // then
        expect(response.statusCode).to.equal(403);
        expect(response.isTakeOver).to.be.true;
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should forbid resource access when user does not have role Super Admin', async function () {
        // given
        checkAdminMemberHasRoleSuperAdminUseCase.execute.resolves(false);

        // when
        const response = await securityPreHandlers.checkAdminMemberHasRoleSuperAdmin(request, hFake);

        // then
        expect(response.statusCode).to.equal(403);
        expect(response.isTakeOver).to.be.true;
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should forbid resource access when an error is thrown by use case', async function () {
        // given
        checkAdminMemberHasRoleSuperAdminUseCase.execute.rejects(new Error('Some error'));

        // when
        const response = await securityPreHandlers.checkAdminMemberHasRoleSuperAdmin(request, hFake);

        // then
        expect(response.statusCode).to.equal(403);
        expect(response.isTakeOver).to.be.true;
      });
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#checkAdminMemberHasRoleCertif', function () {
    let hasRoleCertifStub: $TSFixMe;
    let request: $TSFixMe;

    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(function () {
      sinon.stub(tokenService, 'extractTokenFromAuthChain');
      hasRoleCertifStub = sinon.stub(checkAdminMemberHasRoleCertifUseCase, 'execute');
      request = { auth: { credentials: { accessToken: 'valid.access.token', userId: 1234 } } };
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('Successful case', function () {
      // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
      beforeEach(function () {
        hasRoleCertifStub.resolves({ user_id: 1234 });
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should authorize access to resource when the user is authenticated and has role Certif', async function () {
        // given

        // when
        const response = await securityPreHandlers.checkAdminMemberHasRoleCertif(request, hFake);

        // then
        expect(response.source).to.equal(true);
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('Error cases', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should forbid resource access when user was not previously authenticated', async function () {
        // given
        delete request.auth.credentials;

        // when
        const response = await securityPreHandlers.checkAdminMemberHasRoleCertif(request, hFake);

        // then
        expect(response.statusCode).to.equal(403);
        expect(response.isTakeOver).to.be.true;
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should forbid resource access when user does not have role Certif', async function () {
        // given
        checkAdminMemberHasRoleCertifUseCase.execute.resolves(false);

        // when
        const response = await securityPreHandlers.checkAdminMemberHasRoleCertif(request, hFake);

        // then
        expect(response.statusCode).to.equal(403);
        expect(response.isTakeOver).to.be.true;
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should forbid resource access when an error is thrown by use case', async function () {
        // given
        checkAdminMemberHasRoleCertifUseCase.execute.rejects(new Error('Some error'));

        // when
        const response = await securityPreHandlers.checkAdminMemberHasRoleCertif(request, hFake);

        // then
        expect(response.statusCode).to.equal(403);
        expect(response.isTakeOver).to.be.true;
      });
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#checkAdminMemberHasRoleSupport', function () {
    let hasRoleSupportStub: $TSFixMe;
    let request: $TSFixMe;

    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(function () {
      sinon.stub(tokenService, 'extractTokenFromAuthChain');
      hasRoleSupportStub = sinon.stub(checkAdminMemberHasRoleSupportUseCase, 'execute');
      request = { auth: { credentials: { accessToken: 'valid.access.token', userId: 1234 } } };
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('Successful case', function () {
      // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
      beforeEach(function () {
        hasRoleSupportStub.resolves({ user_id: 1234 });
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should authorize access to resource when the user is authenticated and has role Support', async function () {
        // given

        // when
        const response = await securityPreHandlers.checkAdminMemberHasRoleSupport(request, hFake);

        // then
        expect(response.source).to.equal(true);
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('Error cases', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should forbid resource access when user was not previously authenticated', async function () {
        // given
        delete request.auth.credentials;

        // when
        const response = await securityPreHandlers.checkAdminMemberHasRoleSupport(request, hFake);

        // then
        expect(response.statusCode).to.equal(403);
        expect(response.isTakeOver).to.be.true;
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should forbid resource access when user does not have role Support', async function () {
        // given
        checkAdminMemberHasRoleSupportUseCase.execute.resolves(false);

        // when
        const response = await securityPreHandlers.checkAdminMemberHasRoleSupport(request, hFake);

        // then
        expect(response.statusCode).to.equal(403);
        expect(response.isTakeOver).to.be.true;
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should forbid resource access when an error is thrown by use case', async function () {
        // given
        checkAdminMemberHasRoleSupportUseCase.execute.rejects(new Error('Some error'));

        // when
        const response = await securityPreHandlers.checkAdminMemberHasRoleSupport(request, hFake);

        // then
        expect(response.statusCode).to.equal(403);
        expect(response.isTakeOver).to.be.true;
      });
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#checkAdminMemberHasRoleMetier', function () {
    let hasRoleMetierStub: $TSFixMe;
    let request: $TSFixMe;

    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(function () {
      sinon.stub(tokenService, 'extractTokenFromAuthChain');
      hasRoleMetierStub = sinon.stub(checkAdminMemberHasRoleMetierUseCase, 'execute');
      request = { auth: { credentials: { accessToken: 'valid.access.token', userId: 1234 } } };
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('Successful case', function () {
      // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
      beforeEach(function () {
        hasRoleMetierStub.resolves({ user_id: 1234 });
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should authorize access to resource when the user is authenticated and has role Metier', async function () {
        // given

        // when
        const response = await securityPreHandlers.checkAdminMemberHasRoleMetier(request, hFake);

        // then
        expect(response.source).to.equal(true);
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('Error cases', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should forbid resource access when user was not previously authenticated', async function () {
        // given
        delete request.auth.credentials;

        // when
        const response = await securityPreHandlers.checkAdminMemberHasRoleMetier(request, hFake);

        // then
        expect(response.statusCode).to.equal(403);
        expect(response.isTakeOver).to.be.true;
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should forbid resource access when user does not have role Metier', async function () {
        // given
        checkAdminMemberHasRoleMetierUseCase.execute.resolves(false);

        // when
        const response = await securityPreHandlers.checkAdminMemberHasRoleMetier(request, hFake);

        // then
        expect(response.statusCode).to.equal(403);
        expect(response.isTakeOver).to.be.true;
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should forbid resource access when an error is thrown by use case', async function () {
        // given
        checkAdminMemberHasRoleMetierUseCase.execute.rejects(new Error('Some error'));

        // when
        const response = await securityPreHandlers.checkAdminMemberHasRoleMetier(request, hFake);

        // then
        expect(response.statusCode).to.equal(403);
        expect(response.isTakeOver).to.be.true;
      });
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#checkRequestedUserIsAuthenticatedUser', function () {
    let request: $TSFixMe;

    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(function () {
      sinon.stub(tokenService, 'extractTokenFromAuthChain');
      request = {
        params: { id: '1234' },
        auth: { credentials: { accessToken: 'valid.access.token', userId: 1234 } },
      };
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('Successful case', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should authorize access to resource when the authenticated user is the same as the requested user (id)', async function () {
        // when
        const response = await securityPreHandlers.checkRequestedUserIsAuthenticatedUser(request, hFake);

        // then
        expect(response.source).to.equal(true);
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should authorize access to resource when the authenticated user is the same as the requested user (userId)', async function () {
        // when
        const response = await securityPreHandlers.checkRequestedUserIsAuthenticatedUser(request, hFake);

        // then
        expect(response.source).to.equal(true);
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('Error cases', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should forbid resource access when user was not previously authenticated', async function () {
        // given
        delete request.auth.credentials;

        // when
        const response = await securityPreHandlers.checkRequestedUserIsAuthenticatedUser(request, hFake);

        // then
        expect(response.statusCode).to.equal(403);
        expect(response.isTakeOver).to.be.true;
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should forbid resource access when requested user is not the same as authenticated user', async function () {
        // given
        request.params.id = '5678';

        // when
        const response = await securityPreHandlers.checkRequestedUserIsAuthenticatedUser(request, hFake);

        // then
        expect(response.statusCode).to.equal(403);
        expect(response.isTakeOver).to.be.true;
      });
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#checkUserIsAdminInOrganization', function () {
    let isAdminInOrganizationStub: $TSFixMe;

    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(function () {
      sinon.stub(tokenService, 'extractTokenFromAuthChain');
      isAdminInOrganizationStub = sinon.stub(checkUserIsAdminInOrganizationUseCase, 'execute');
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('Successful case', function () {
      let request: $TSFixMe;

      // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
      beforeEach(function () {
        isAdminInOrganizationStub.resolves(true);
        request = {
          auth: { credentials: { accessToken: 'valid.access.token', userId: 1234 } },
          params: { id: 5678 },
        };
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should authorize access to resource when the user is authenticated and is ADMIN in Organization', async function () {
        // given

        // when
        const response = await securityPreHandlers.checkUserIsAdminInOrganization(request, hFake);

        // then
        expect(response.source).to.equal(true);
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('Error cases', function () {
      let request: $TSFixMe;

      // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
      beforeEach(function () {
        isAdminInOrganizationStub.resolves(true);
        request = { auth: { credentials: { accessToken: 'valid.access.token' } }, params: { id: 5678 } };
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should forbid resource access when user was not previously authenticated', async function () {
        // given
        delete request.auth.credentials;

        // when
        const response = await securityPreHandlers.checkUserIsAdminInOrganization(request, hFake);

        // then
        expect(response.statusCode).to.equal(403);
        expect(response.isTakeOver).to.be.true;
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should forbid resource access when user is not ADMIN in Organization', async function () {
        // given
        checkUserIsAdminInOrganizationUseCase.execute.resolves(false);

        // when
        const response = await securityPreHandlers.checkUserIsAdminInOrganization(request, hFake);

        // then
        expect(response.statusCode).to.equal(403);
        expect(response.isTakeOver).to.be.true;
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should forbid resource access when an error is thrown by use case', async function () {
        // given
        checkUserIsAdminInOrganizationUseCase.execute.rejects(new Error('Some error'));

        // when
        const response = await securityPreHandlers.checkUserIsAdminInOrganization(request, hFake);

        // then
        expect(response.statusCode).to.equal(403);
        expect(response.isTakeOver).to.be.true;
      });
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#checkUserBelongsToOrganizationManagingStudents', function () {
    let belongToOrganizationManagingStudentsStub: $TSFixMe;
    let request: $TSFixMe;
    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(function () {
      belongToOrganizationManagingStudentsStub = sinon.stub(
        checkUserBelongsToOrganizationManagingStudentsUseCase,
        'execute'
      );
      request = {
        auth: {
          credentials: {
            accessToken: 'valid.access.token',
            userId: 1234,
          },
        },
        params: { id: 5678 },
      };
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('Successful case', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should authorize access to resource when the user is authenticated, belongs to an Organization and manages students', async function () {
        // given
        belongToOrganizationManagingStudentsStub.resolves(true);

        // when
        const response = await securityPreHandlers.checkUserBelongsToOrganizationManagingStudents(request, hFake);

        // then
        expect(response.source).to.equal(true);
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('Error cases', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should forbid resource access when user was not previously authenticated', async function () {
        // given
        delete request.auth.credentials;

        // when
        const response = await securityPreHandlers.checkUserBelongsToOrganizationManagingStudents(request, hFake);

        // then
        expect(response.statusCode).to.equal(403);
        expect(response.isTakeOver).to.be.true;
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should forbid resource access when user does not belong to an Organization or manage students', async function () {
        // given
        belongToOrganizationManagingStudentsStub.resolves(false);

        // when
        const response = await securityPreHandlers.checkUserBelongsToOrganizationManagingStudents(request, hFake);

        // then
        expect(response.statusCode).to.equal(403);
        expect(response.isTakeOver).to.be.true;
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should forbid resource access when an error is thrown by use case', async function () {
        // given
        belongToOrganizationManagingStudentsStub.rejects(new Error('Some error'));

        // when
        const response = await securityPreHandlers.checkUserBelongsToOrganizationManagingStudents(request, hFake);

        // then
        expect(response.statusCode).to.equal(403);
        expect(response.isTakeOver).to.be.true;
      });
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#checkUserBelongsToScoOrganizationAndManagesStudents', function () {
    let belongToScoOrganizationAndManageStudentsStub: $TSFixMe;
    let request: $TSFixMe;

    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(function () {
      belongToScoOrganizationAndManageStudentsStub = sinon.stub(
        checkUserBelongsToScoOrganizationAndManagesStudentsUseCase,
        'execute'
      );
      request = {
        auth: {
          credentials: {
            accessToken: 'valid.access.token',
            userId: 1234,
          },
        },
        params: {
          id: 5678,
        },
      };
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('Successful case', function () {
      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('when organization id is in request params', function () {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should authorize access to resource when the user is authenticated, belongs to SCO Organization and manages students', async function () {
          // given
          belongToScoOrganizationAndManageStudentsStub.resolves(true);

          // when
          const response = await securityPreHandlers.checkUserBelongsToScoOrganizationAndManagesStudents(
            request,
            hFake
          );

          // then
          expect(response.source).to.equal(true);
        });
      });

      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('when organization id is in request payload', function () {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should authorize access to resource when the user is authenticated, belongs to SCO Organization and manages students', async function () {
          // given
          request.payload = {
            data: {
              attributes: {
                organizationId: 5678,
              },
            },
          };
          belongToScoOrganizationAndManageStudentsStub.resolves(true);

          // when
          const response = await securityPreHandlers.checkUserBelongsToScoOrganizationAndManagesStudents(
            request,
            hFake
          );

          // then
          expect(response.source).to.equal(true);
        });
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('Error cases', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should forbid resource access when user was not previously authenticated', async function () {
        // given
        delete request.auth.credentials;

        // when
        const response = await securityPreHandlers.checkUserBelongsToScoOrganizationAndManagesStudents(request, hFake);

        // then
        expect(response.statusCode).to.equal(403);
        expect(response.isTakeOver).to.be.true;
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should forbid resource access when user does not belong to SCO Organization or manage students', async function () {
        // given
        belongToScoOrganizationAndManageStudentsStub.resolves(false);

        // when
        const response = await securityPreHandlers.checkUserBelongsToScoOrganizationAndManagesStudents(request, hFake);

        // then
        expect(response.statusCode).to.equal(403);
        expect(response.isTakeOver).to.be.true;
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should forbid resource access when an error is thrown by use case', async function () {
        // given
        belongToScoOrganizationAndManageStudentsStub.rejects(new Error('Some error'));

        // when
        const response = await securityPreHandlers.checkUserBelongsToScoOrganizationAndManagesStudents(request, hFake);

        // then
        expect(response.statusCode).to.equal(403);
        expect(response.isTakeOver).to.be.true;
      });
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#adminMemberHasAtLeastOneAccessOf', function () {
    let belongsToOrganizationStub: $TSFixMe;
    let hasRoleSuperAdminStub: $TSFixMe;
    let request: $TSFixMe;

    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(function () {
      belongsToOrganizationStub = sinon.stub(securityPreHandlers, 'checkUserBelongsToOrganization');
      hasRoleSuperAdminStub = sinon.stub(securityPreHandlers, 'checkAdminMemberHasRoleSuperAdmin');
      request = {
        auth: {
          credentials: {
            accessToken: 'valid.access.token',
            userId: 1234,
          },
        },
        params: { id: 5678 },
      };
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('Successful case', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should authorize access to resource when the user is authenticated and belongs to organization', async function () {
        // given
        belongsToOrganizationStub.callsFake((request: $TSFixMe, h: $TSFixMe) => h.response(true));
        hasRoleSuperAdminStub.callsFake((request: $TSFixMe, h: $TSFixMe) => h.response({ errors: new Error('forbidden') }).code(403));

        // when
        const response = await securityPreHandlers.adminMemberHasAtLeastOneAccessOf([
          belongsToOrganizationStub,
          hasRoleSuperAdminStub,
        ])(request, hFake);

        // then
        expect(response).to.equal(true);
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should authorize access to resource when the user is authenticated and is Super Admin', async function () {
        // given
        belongsToOrganizationStub.callsFake((request: $TSFixMe, h: $TSFixMe) => h.response({ errors: new Error('forbidden') }).code(403));
        hasRoleSuperAdminStub.callsFake((request: $TSFixMe, h: $TSFixMe) => h.response(true));

        // when
        const response = await securityPreHandlers.adminMemberHasAtLeastOneAccessOf([
          belongsToOrganizationStub,
          hasRoleSuperAdminStub,
        ])(request, hFake);

        // then
        expect(response).to.equal(true);
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should authorize access to resource when the user is authenticated and belongs to organization and is Super Admin', async function () {
        // given
        belongsToOrganizationStub.callsFake((request: $TSFixMe, h: $TSFixMe) => h.response(true));
        hasRoleSuperAdminStub.callsFake((request: $TSFixMe, h: $TSFixMe) => h.response(true));

        // when
        const response = await securityPreHandlers.adminMemberHasAtLeastOneAccessOf([
          belongsToOrganizationStub,
          hasRoleSuperAdminStub,
        ])(request, hFake);

        // then
        expect(response).to.equal(true);
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('Error cases', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should forbid resource access when user does not belong to organization nor has role Super Admin', async function () {
        // given
        belongsToOrganizationStub.callsFake((request: $TSFixMe, h: $TSFixMe) => h.response({ errors: new Error('forbidden') }).code(403));
        hasRoleSuperAdminStub.callsFake((request: $TSFixMe, h: $TSFixMe) => h.response({ errors: new Error('forbidden') }).code(403));

        // when
        const response = await securityPreHandlers.adminMemberHasAtLeastOneAccessOf([
          belongsToOrganizationStub,
          hasRoleSuperAdminStub,
        ])(request, hFake);

        // then
        expect(response.statusCode).to.equal(403);
        expect(response.isTakeOver).to.be.true;
      });
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#checkUserIsMemberOfAnOrganization', function () {
    let isMemberOfAnOrganizationStub: $TSFixMe;
    let request: $TSFixMe;

    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(function () {
      isMemberOfAnOrganizationStub = sinon.stub(checkUserIsMemberOfAnOrganizationUseCase, 'execute');
      request = {
        auth: {
          credentials: {
            accessToken: 'valid.access.token',
            userId: 1234,
          },
        },
      };
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('Successful case', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should authorize access to resource when the user is authenticated and member of an organization', async function () {
        // given
        isMemberOfAnOrganizationStub.resolves(true);

        // when
        const response = await securityPreHandlers.checkUserIsMemberOfAnOrganization(request, hFake);
        // then
        expect(response.source).to.equal(true);
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('Error cases', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should forbid resource access when user was not previously authenticated', async function () {
        // given
        delete request.auth.credentials;

        // when
        const response = await securityPreHandlers.checkUserIsMemberOfAnOrganization(request, hFake);

        // then
        expect(response.statusCode).to.equal(403);
        expect(response.isTakeOver).to.be.true;
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should forbid resource access when user is not a member of any organization', async function () {
        // given
        isMemberOfAnOrganizationStub.resolves(false);

        // when
        const response = await securityPreHandlers.checkUserIsMemberOfAnOrganization(request, hFake);

        // then
        expect(response.statusCode).to.equal(403);
        expect(response.isTakeOver).to.be.true;
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should forbid resource access when an error is thrown by use case', async function () {
        // given
        isMemberOfAnOrganizationStub.rejects(new Error('Some error'));

        // when
        const response = await securityPreHandlers.checkUserIsMemberOfAnOrganization(request, hFake);

        // then
        expect(response.statusCode).to.equal(403);
        expect(response.isTakeOver).to.be.true;
      });
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#checkUserIsMemberOfCertificationCenter', function () {
    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('Successful case', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should authorize access to resource when the user is authenticated and is member in certification center', async function () {
        // given
        const user = domainBuilder.buildUser();
        const certificationCenter = domainBuilder.buildCertificationCenter();
        const certificationCenterMembership = domainBuilder.buildCertificationCenterMembership({
          user,
          certificationCenter,
        });
        const request = {
          auth: { credentials: { accessToken: 'valid.access.token', userId: certificationCenterMembership.user.id } },
          params: { certificationCenterId: certificationCenterMembership.certificationCenter.id },
        };

        sinon.stub(tokenService, 'extractTokenFromAuthChain');
        sinon.stub(checkUserIsMemberOfCertificationCenterUseCase, 'execute').resolves(true);

        // when
        const response = await securityPreHandlers.checkUserIsMemberOfCertificationCenter(request, hFake);

        // then
        expect(response.source).to.equal(true);
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('Error cases', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should forbid resource access when user is not member in certification center', async function () {
        // given
        const userId = domainBuilder.buildUser().id;
        const certificationCenterId = domainBuilder.buildCertificationCenter().id;
        const request = {
          auth: { credentials: { accessToken: 'valid.access.token', userId } },
          params: { certificationCenterId },
        };

        sinon.stub(tokenService, 'extractTokenFromAuthChain');
        sinon.stub(checkUserIsMemberOfCertificationCenterUseCase, 'execute').resolves(false);

        // when
        const response = await securityPreHandlers.checkUserIsMemberOfCertificationCenter(request, hFake);

        // then
        expect(response.statusCode).to.equal(403);
      });
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#checkAuthorizationToManageCampaign', function () {
    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('Successful case', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should authorize access to resource when the user is authenticated and is admin in organization and owner of the campaign', async function () {
        // given
        const user = domainBuilder.buildUser();
        const organization = domainBuilder.buildOrganization();
        domainBuilder.buildMembership({ organization, user, organizationRole: 'ADMIN' });
        const campaign = domainBuilder.buildCampaign({ organizationId: organization.id, ownerId: user.id });

        const request = {
          auth: { credentials: { accessToken: 'valid.access.token', userId: user.id } },
          params: { id: campaign.id },
        };

        sinon.stub(tokenService, 'extractTokenFromAuthChain');
        sinon
          .stub(checkAuthorizationToManageCampaignUsecase, 'execute')
          .withArgs({ userId: user.id, campaignId: campaign.id })
          .resolves(true);

        // when
        const response = await securityPreHandlers.checkAuthorizationToManageCampaign(request, hFake);

        // then
        expect(response.source).to.equal(true);
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('Error cases', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should forbid resource access when user is member but does not own the campaign', async function () {
        // given
        const user = domainBuilder.buildUser();
        const otherUser = domainBuilder.buildUser();
        const organization = domainBuilder.buildOrganization();
        domainBuilder.buildMembership({ organization, user, organizationRole: 'MEMBER' });
        const campaign = domainBuilder.buildCampaign({ organizationId: organization.id, ownerId: otherUser.id });

        const request = {
          auth: { credentials: { accessToken: 'valid.access.token', userId: user.id } },
          params: { id: campaign.id },
        };

        sinon.stub(tokenService, 'extractTokenFromAuthChain');
        sinon
          .stub(checkAuthorizationToManageCampaignUsecase, 'execute')
          .withArgs({ userId: user.id, campaignId: campaign.id })
          .resolves(false);

        // when
        const response = await securityPreHandlers.checkAuthorizationToManageCampaign(request, hFake);

        // then
        expect(response.statusCode).to.equal(403);
        expect(response.isTakeOver).to.be.true;
      });
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#checkUserIsMemberOfCertificationCenterSessionFromCertificationCourseId', function () {
    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('Successful case', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should authorize access to resource when the user is a member of the organization center', async function () {
        // given
        const userId = 123;
        const certificationCourseId = 7;
        sinon
          .stub(checkUserIsMemberOfCertificationCenterSessionUsecase, 'execute')
          .withArgs({ userId, certificationCourseId })
          .resolves(true);

        // when
        const response =
          await securityPreHandlers.checkUserIsMemberOfCertificationCenterSessionFromCertificationCourseId(
            {
              auth: { credentials: { accessToken: 'valid.access.token', userId: 123 } },
              params: { id: 7 },
            },
            hFake
          );

        // then
        expect(response.source).to.equal(true);
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('Error cases', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should forbid resource access when user was not previously authenticated', async function () {
        // given & when
        const response =
          await securityPreHandlers.checkUserIsMemberOfCertificationCenterSessionFromCertificationCourseId(
            { auth: { credentials: {} }, params: { id: 5678 } },
            hFake
          );

        // then
        expect(response.statusCode).to.equal(403);
        expect(response.isTakeOver).to.be.true;
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should forbid resource access when user is not a member of the organization center', async function () {
        // given
        sinon.stub(checkUserIsMemberOfCertificationCenterSessionUsecase, 'execute').resolves(false);

        // when
        const response =
          await securityPreHandlers.checkUserIsMemberOfCertificationCenterSessionFromCertificationCourseId(
            { auth: { credentials: { accessToken: 'valid.access.token', userId: 1 } }, params: { id: 5678 } },
            hFake
          );

        // then
        expect(response.statusCode).to.equal(403);
        expect(response.isTakeOver).to.be.true;
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should forbid resource access when an error is thrown by use case', async function () {
        // given
        sinon.stub(checkUserIsMemberOfCertificationCenterSessionUsecase, 'execute').rejects(new Error('Some error'));

        // when
        const response =
          await securityPreHandlers.checkUserIsMemberOfCertificationCenterSessionFromCertificationCourseId(
            { auth: { credentials: { accessToken: 'valid.access.token', userId: 1 } }, params: { id: 5678 } },
            hFake
          );

        // then
        expect(response.statusCode).to.equal(403);
        expect(response.isTakeOver).to.be.true;
      });
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#checkUserIsMemberOfCertificationCenterSessionFromCertificationIssueReportId', function () {
    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('Successful case', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should authorize access to resource when the user is a member of the organization center', async function () {
        // given
        const userId = 123;
        const certificationCourseId = 7;
        const certificationIssueReportId = 666;
        sinon
          .stub(certificationIssueReportRepository, 'get')
          .withArgs(certificationIssueReportId)
          .resolves({ certificationCourseId });
        sinon
          .stub(checkUserIsMemberOfCertificationCenterSessionUsecase, 'execute')
          .withArgs({ userId, certificationCourseId })
          .resolves(true);

        // when
        const response =
          await securityPreHandlers.checkUserIsMemberOfCertificationCenterSessionFromCertificationIssueReportId(
            {
              auth: { credentials: { accessToken: 'valid.access.token', userId: 123 } },
              params: { id: 666 },
            },
            hFake
          );

        // then
        expect(response.source).to.equal(true);
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('Error cases', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should forbid resource access when user was not previously authenticated', async function () {
        // given & when
        const response =
          await securityPreHandlers.checkUserIsMemberOfCertificationCenterSessionFromCertificationIssueReportId(
            { auth: { credentials: {} }, params: { id: 5678 } },
            hFake
          );

        // then
        expect(response.statusCode).to.equal(403);
        expect(response.isTakeOver).to.be.true;
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should forbid resource access when user is not a member of the organization center', async function () {
        // given
        sinon.stub(certificationIssueReportRepository, 'get').resolves({ certificationCourseId: 7 });
        sinon.stub(checkUserIsMemberOfCertificationCenterSessionUsecase, 'execute').resolves(false);

        // when
        const response =
          await securityPreHandlers.checkUserIsMemberOfCertificationCenterSessionFromCertificationIssueReportId(
            { auth: { credentials: { accessToken: 'valid.access.token', userId: 1 } }, params: { id: 666 } },
            hFake
          );

        // then
        expect(response.statusCode).to.equal(403);
        expect(response.isTakeOver).to.be.true;
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should forbid resource access when an error is thrown by use case', async function () {
        // given
        sinon.stub(certificationIssueReportRepository, 'get').resolves({ certificationCourseId: 7 });
        sinon.stub(checkUserIsMemberOfCertificationCenterSessionUsecase, 'execute').rejects(new Error('Some error'));

        // when
        const response =
          await securityPreHandlers.checkUserIsMemberOfCertificationCenterSessionFromCertificationIssueReportId(
            { auth: { credentials: { accessToken: 'valid.access.token', userId: 1 } }, params: { id: 666 } },
            hFake
          );

        // then
        expect(response.statusCode).to.equal(403);
        expect(response.isTakeOver).to.be.true;
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should forbid resource access when an error is thrown by repo', async function () {
        // given
        sinon.stub(certificationIssueReportRepository, 'get').rejects(new Error('Some error'));

        // when
        const response =
          await securityPreHandlers.checkUserIsMemberOfCertificationCenterSessionFromCertificationIssueReportId(
            { auth: { credentials: { accessToken: 'valid.access.token', userId: 1 } }, params: { id: 666 } },
            hFake
          );

        // then
        expect(response.statusCode).to.equal(403);
        expect(response.isTakeOver).to.be.true;
      });
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#checkUserOwnsCertificationCourse', function () {
    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('Successful case', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should authorize access to resource when the user owns the certification course', async function () {
        // given
        const userId = 123;
        const certificationCourseId = 7;
        sinon
          .stub(checkUserOwnsCertificationCourseUseCase, 'execute')
          .withArgs({ userId, certificationCourseId })
          .resolves(true);

        // when
        const response = await securityPreHandlers.checkUserOwnsCertificationCourse(
          {
            auth: { credentials: { accessToken: 'valid.access.token', userId: 123 } },
            params: { id: 7 },
          },
          hFake
        );

        // then
        expect(response.source).to.equal(true);
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('Error cases', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should forbid resource access when user was not previously authenticated', async function () {
        // given & when
        const response = await securityPreHandlers.checkUserOwnsCertificationCourse(
          { auth: { credentials: {} }, params: { id: 5678 } },
          hFake
        );

        // then
        expect(response.statusCode).to.equal(403);
        expect(response.isTakeOver).to.be.true;
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should forbid resource access when user does not own the certification course', async function () {
        // given
        sinon.stub(checkUserOwnsCertificationCourseUseCase, 'execute').resolves(false);

        // when
        const response = await securityPreHandlers.checkUserOwnsCertificationCourse(
          { auth: { credentials: { accessToken: 'valid.access.token', userId: 1 } }, params: { id: 5678 } },
          hFake
        );

        // then
        expect(response.statusCode).to.equal(403);
        expect(response.isTakeOver).to.be.true;
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should forbid resource access when an error is thrown by use case', async function () {
        // given
        sinon.stub(checkUserOwnsCertificationCourseUseCase, 'execute').rejects(new Error('Some error'));

        // when
        const response = await securityPreHandlers.checkUserOwnsCertificationCourse(
          { auth: { credentials: { accessToken: 'valid.access.token', userId: 1 } }, params: { id: 5678 } },
          hFake
        );

        // then
        expect(response.statusCode).to.equal(403);
        expect(response.isTakeOver).to.be.true;
      });
    });
  });
});
