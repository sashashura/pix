// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, sinon, domainBuilder, HttpTestServer } = require('../../../test-helper');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'securityPr... Remove this comment to see the full error message
const securityPreHandlers = require('../../../../lib/application/security-pre-handlers');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'usecases'.
const usecases = require('../../../../lib/domain/usecases');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Organizati... Remove this comment to see the full error message
const OrganizationInvitation = require('../../../../lib/domain/models/OrganizationInvitation');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'ScoOrganiz... Remove this comment to see the full error message
const ScoOrganizationParticipant = require('../../../../lib/domain/read-models/ScoOrganizationParticipant');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'SupOrganiz... Remove this comment to see the full error message
const SupOrganizationParticipant = require('../../../../lib/domain/read-models/SupOrganizationParticipant');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'certificat... Remove this comment to see the full error message
const certificationAttestationPdf = require('../../../../lib/infrastructure/utils/pdf/certification-attestation-pdf');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'moduleUnde... Remove this comment to see the full error message
const moduleUnderTest = require('../../../../lib/application/organizations');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'NoCertific... Remove this comment to see the full error message
const { NoCertificationAttestationForDivisionError } = require('../../../../lib/domain/errors');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Integration | Application | Organizations | organization-controller', function () {
  let sandbox: $TSFixMe;
  let httpTestServer: $TSFixMe;

  // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
  beforeEach(async function () {
    sandbox = sinon.createSandbox();
    sandbox.stub(usecases, 'updateOrganizationInformation');
    sandbox.stub(usecases, 'findPaginatedFilteredOrganizationMemberships');
    sandbox.stub(usecases, 'findPaginatedFilteredOrganizationLearners');
    sandbox.stub(usecases, 'findPaginatedFilteredScoParticipants');
    sandbox.stub(usecases, 'findPaginatedFilteredSupParticipants');
    sandbox.stub(usecases, 'createOrganizationInvitations');
    sandbox.stub(usecases, 'acceptOrganizationInvitation');
    sandbox.stub(usecases, 'findPendingOrganizationInvitations');
    sandbox.stub(usecases, 'attachTargetProfilesToOrganization');
    sandbox.stub(usecases, 'findCertificationAttestationsForDivision');
    sandbox.stub(usecases, 'findGroupsByOrganization');
    sandbox.stub(usecases, 'findDivisionsByOrganization');
    sandbox.stub(usecases, 'getPaginatedParticipantsForAnOrganization');
    sandbox.stub(usecases, 'findOrganizationPlacesLot');

    sandbox.stub(certificationAttestationPdf, 'getCertificationAttestationsPdfBuffer');

    sandbox.stub(securityPreHandlers, 'checkUserIsAdminInOrganization');
    sandbox.stub(securityPreHandlers, 'checkAdminMemberHasRoleSuperAdmin');
    sandbox.stub(securityPreHandlers, 'checkUserBelongsToOrganizationManagingStudents');
    sandbox.stub(securityPreHandlers, 'checkUserBelongsToScoOrganizationAndManagesStudents');
    sandbox.stub(securityPreHandlers, 'checkUserBelongsToSupOrganizationAndManagesStudents');
    sandbox.stub(securityPreHandlers, 'checkUserIsAdminInSCOOrganizationManagingStudents');
    sandbox.stub(securityPreHandlers, 'adminMemberHasAtLeastOneAccessOf');
    sandbox.stub(securityPreHandlers, 'checkUserBelongsToOrganization');
    httpTestServer = new HttpTestServer();
    await httpTestServer.register(moduleUnderTest);
  });

  // @ts-expect-error TS(2304): Cannot find name 'afterEach'.
  afterEach(function () {
    sandbox.restore();
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#updateOrganizationInformation', function () {
    const payload = {
      data: {
        type: 'organizations',
        id: '1',
        attributes: {
          name: 'The name of the organization',
          type: 'PRO',
          code: 'ABCD12',
          'logo-url': 'http://log.url',
          'external-id': '02A2145V',
          'province-code': '02A',
          email: 'sco.generic.newaccount@example.net',
          credit: 10,
        },
      },
    };

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('Success cases', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should resolve a 200 HTTP response', async function () {
        // given
        const organization = domainBuilder.buildOrganization();
        usecases.updateOrganizationInformation.resolves(organization);
        securityPreHandlers.adminMemberHasAtLeastOneAccessOf.returns(() => true);

        // when
        const response = await httpTestServer.request('PATCH', '/api/admin/organizations/1234', payload);

        // then
        expect(response.statusCode).to.equal(200);
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return a JSON API organization', async function () {
        // given
        const organization = domainBuilder.buildOrganization();
        usecases.updateOrganizationInformation.resolves(organization);
        securityPreHandlers.adminMemberHasAtLeastOneAccessOf.returns(() => true);

        // when
        const response = await httpTestServer.request('PATCH', '/api/admin/organizations/1234', payload);

        // then
        expect(response.result.data.type).to.equal('organizations');
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('Error cases', function () {
      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('when user is not allowed to access resource', function () {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should resolve a 403 HTTP response', async function () {
          // given
          securityPreHandlers.adminMemberHasAtLeastOneAccessOf.returns((request: $TSFixMe, h: $TSFixMe) =>
            h.response().code(403).takeover()
          );

          // when
          const response = await httpTestServer.request('PATCH', '/api/admin/organizations/1234', payload);

          // then
          expect(response.statusCode).to.equal(403);
        });
      });
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#findPaginatedFilteredOrganizationMemberships', function () {
    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('Success cases', function () {
      // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
      beforeEach(function () {
        securityPreHandlers.adminMemberHasAtLeastOneAccessOf.returns(() => true);
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return an HTTP response with status code 200', async function () {
        // given
        const membership = domainBuilder.buildMembership();
        usecases.findPaginatedFilteredOrganizationMemberships.resolves({ models: [membership], pagination: {} });

        // when
        const response = await httpTestServer.request('GET', '/api/organizations/1234/memberships');

        // then
        expect(response.statusCode).to.equal(200);
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return an HTTP response formatted as JSON:API', async function () {
        // given
        const membership = domainBuilder.buildMembership();
        usecases.findPaginatedFilteredOrganizationMemberships.resolves({ models: [membership], pagination: {} });

        // when
        const response = await httpTestServer.request('GET', '/api/organizations/1234/memberships');

        // then
        expect(response.result.data[0].type).to.equal('memberships');
        expect(response.result.data[0].id).to.equal(membership.id.toString());
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return a JSON:API response including organization, organization role & user information', async function () {
        // given
        const membership = domainBuilder.buildMembership();
        usecases.findPaginatedFilteredOrganizationMemberships.resolves({ models: [membership], pagination: {} });

        // when
        const response = await httpTestServer.request('GET', '/api/organizations/1234/memberships');

        // then
        expect(response.result.included[0].type).to.equal('organizations');
        expect(response.result.included[0].id).to.equal(`${membership.organization.id}`);
        expect(response.result.included[1].type).to.equal('users');
        expect(response.result.included[1].id).to.equal(`${membership.user.id}`);
      });
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#findPaginatedFilteredOrganizationLearners', function () {
    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('Success cases', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return an HTTP response with status code 200', async function () {
        // given
        const studentWithUserInfo = domainBuilder.buildUserWithOrganizationLearner();
        usecases.findPaginatedFilteredOrganizationLearners.resolves({ data: [studentWithUserInfo] });
        securityPreHandlers.checkUserBelongsToOrganizationManagingStudents.returns(true);

        // when
        const response = await httpTestServer.request('GET', '/api/organizations/1234/students');

        // then
        expect(response.statusCode).to.equal(200);
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return an HTTP response formatted as JSON:API', async function () {
        // given
        const studentWithUserInfo = domainBuilder.buildUserWithOrganizationLearner();
        usecases.findPaginatedFilteredOrganizationLearners.resolves({ data: [studentWithUserInfo] });
        securityPreHandlers.checkUserBelongsToOrganizationManagingStudents.returns(true);

        // when
        const response = await httpTestServer.request('GET', '/api/organizations/1234/students');

        // then
        expect(response.result.data[0].type).to.equal('students');
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('Error cases', function () {
      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('when user is not allowed to access resource', function () {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should resolve a 403 HTTP response', async function () {
          // given
          securityPreHandlers.checkUserBelongsToOrganizationManagingStudents.callsFake((request: $TSFixMe, h: $TSFixMe) => {
            return Promise.resolve(h.response().code(403).takeover());
          });

          // when
          const response = await httpTestServer.request('GET', '/api/organizations/1234/students');

          // then
          expect(response.statusCode).to.equal(403);
        });
      });
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#findPaginatedFilteredScoParticipants', function () {
    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('Success cases', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return an HTTP response with status code 200', async function () {
        // given
        const scoOrganizationParticipant = new ScoOrganizationParticipant();
        usecases.findPaginatedFilteredScoParticipants.resolves({ data: [scoOrganizationParticipant] });
        securityPreHandlers.checkUserBelongsToScoOrganizationAndManagesStudents.returns(true);

        // when
        const response = await httpTestServer.request('GET', '/api/organizations/1234/sco-participants');

        // then
        expect(response.statusCode).to.equal(200);
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return an HTTP response formatted as JSON:API', async function () {
        // given
        const scoOrganizationParticipant = new ScoOrganizationParticipant();
        usecases.findPaginatedFilteredScoParticipants.resolves({ data: [scoOrganizationParticipant] });
        securityPreHandlers.checkUserBelongsToScoOrganizationAndManagesStudents.returns(true);

        // when
        const response = await httpTestServer.request('GET', '/api/organizations/1234/sco-participants');

        // then
        expect(response.result.data[0].type).to.equal('sco-organization-participants');
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('Error cases', function () {
      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('when user is not allowed to access resource', function () {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should resolve a 403 HTTP response', async function () {
          // given
          securityPreHandlers.checkUserBelongsToScoOrganizationAndManagesStudents.callsFake((request: $TSFixMe, h: $TSFixMe) => {
            return Promise.resolve(h.response().code(403).takeover());
          });

          // when
          const response = await httpTestServer.request('GET', '/api/organizations/1234/sco-participants');

          // then
          expect(response.statusCode).to.equal(403);
        });
      });
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#findPaginatedFilteredSupParticipants', function () {
    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('Success cases', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return an HTTP response with status code 200', async function () {
        // given
        const supOrganizationParticipant = new SupOrganizationParticipant();
        usecases.findPaginatedFilteredSupParticipants.resolves({ data: [supOrganizationParticipant] });
        securityPreHandlers.checkUserBelongsToSupOrganizationAndManagesStudents.returns(true);

        // when
        const response = await httpTestServer.request('GET', '/api/organizations/1234/sup-participants');

        // then
        expect(response.statusCode).to.equal(200);
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return an HTTP response formatted as JSON:API', async function () {
        // given
        const supOrganizationParticipant = new SupOrganizationParticipant();
        usecases.findPaginatedFilteredSupParticipants.resolves({ data: [supOrganizationParticipant] });
        securityPreHandlers.checkUserBelongsToSupOrganizationAndManagesStudents.returns(true);

        // when
        const response = await httpTestServer.request('GET', '/api/organizations/1234/sup-participants');

        // then
        expect(response.result.data[0].type).to.equal('sup-organization-participants');
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('Error cases', function () {
      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('when user is not allowed to access resource', function () {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should resolve a 403 HTTP response', async function () {
          // given
          securityPreHandlers.checkUserBelongsToSupOrganizationAndManagesStudents.callsFake((request: $TSFixMe, h: $TSFixMe) => {
            return Promise.resolve(h.response().code(403).takeover());
          });

          // when
          const response = await httpTestServer.request('GET', '/api/organizations/1234/sup-participants');

          // then
          expect(response.statusCode).to.equal(403);
        });
      });
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#findPendingInvitations', function () {
    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('Success cases', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return an HTTP response with status code 200', async function () {
        // given
        const invitation = domainBuilder.buildOrganizationInvitation({
          organizationId: 1,
          status: OrganizationInvitation.StatusType.PENDING,
        });
        usecases.findPendingOrganizationInvitations.resolves([invitation]);
        securityPreHandlers.checkUserIsAdminInOrganization.returns(true);

        // when
        const response = await httpTestServer.request('GET', '/api/organizations/1/invitations');

        // then
        expect(response.statusCode).to.equal(200);
      });
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#findOrganizationPlacesLot', function () {
    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('Success cases', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return an HTTP response with status code 200', async function () {
        // given
        const organizationId = domainBuilder.buildOrganization().id;
        const place = domainBuilder.buildOrganizationPlacesLotManagement({
          organizationId,
          count: 18,
          activationDate: new Date('2020-01-01'),
          expirationDate: new Date('2021-01-01'),
          reference: 'Toho Godzilla',
          category: 'T2',
        });
        usecases.findOrganizationPlacesLot.resolves([place]);
        securityPreHandlers.adminMemberHasAtLeastOneAccessOf.returns(() => true);

        // when
        const response = await httpTestServer.request('GET', `/api/admin/organizations/${organizationId}/places`);

        // then
        expect(response.statusCode).to.equal(200);
      });
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#attachTargetProfilesToOrganization', function () {
    const payload = {
      data: {
        type: 'target-profiles-shares',
        attributes: {
          'target-profiles-to-attach': [1, 2],
        },
      },
    };

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('Error cases', function () {
      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('when user has no authorization to access Pix Admin', function () {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should return a 403 HTTP response', async function () {
          // given
          securityPreHandlers.adminMemberHasAtLeastOneAccessOf.returns((request: $TSFixMe, h: $TSFixMe) =>
            h.response().code(403).takeover()
          );

          // when
          const response = await httpTestServer.request(
            'POST',
            '/api/admin/organizations/1234/target-profiles',
            payload
          );

          // then
          expect(response.statusCode).to.equal(403);
        });
      });

      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('when target-profile-id does not contain only numbers', function () {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should return a 404 HTTP response', async function () {
          // given
          securityPreHandlers.adminMemberHasAtLeastOneAccessOf.returns((request: $TSFixMe, h: $TSFixMe) =>
            h.response().code(403).takeover()
          );

          // when
          // @ts-expect-error TS(2322): Type 'string' is not assignable to type 'number'.
          payload.data.attributes['target-profiles-to-attach'] = ['sdqdqsd', 'qsqsdqd'];
          const response = await httpTestServer.request(
            'POST',
            '/api/admin/organizations/1234/target-profiles',
            payload
          );

          // then
          expect(response.statusCode).to.equal(404);
          expect(response.payload).to.have.string("L'id d'un des profils cible n'est pas valide");
        });
      });
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#downloadCertificationAttestationsForDivision', function () {
    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('Success cases', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return an HTTP response with status code 200', async function () {
        // given
        const certifications = [
          domainBuilder.buildPrivateCertificateWithCompetenceTree(),
          domainBuilder.buildPrivateCertificateWithCompetenceTree(),
        ];
        const buffer = 'buffer';
        securityPreHandlers.checkUserIsAdminInSCOOrganizationManagingStudents.returns(true);
        usecases.findCertificationAttestationsForDivision.resolves(certifications);
        certificationAttestationPdf.getCertificationAttestationsPdfBuffer.resolves(buffer);

        // when
        const response = await httpTestServer.request(
          'GET',
          '/api/organizations/1234/certification-attestations?division=3b&isFrenchDomainExtension=true'
        );

        // then
        expect(response.statusCode).to.equal(204);
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('Error cases', function () {
      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('when user is not allowed to access resource', function () {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should resolve a 403 HTTP response', async function () {
          // given
          securityPreHandlers.checkUserIsAdminInSCOOrganizationManagingStudents.callsFake((request: $TSFixMe, h: $TSFixMe) => {
            return Promise.resolve(h.response().code(403).takeover());
          });

          // when
          const response = await httpTestServer.request(
            'GET',
            '/api/organizations/1234/certification-attestations?division=3b&isFrenchDomainExtension=true'
          );

          // then
          expect(response.statusCode).to.equal(403);
        });
      });

      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('when no division is provided as query', function () {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should resolve a 400 HTTP response', async function () {
          // when
          const response = await httpTestServer.request(
            'GET',
            '/api/organizations/1234/certification-attestations?isFrenchDomainExtension=true'
          );

          // then
          expect(response.statusCode).to.equal(400);
        });
      });

      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('when no isFrenchDomainExtension is provided as query', function () {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should resolve a 400 HTTP response', async function () {
          // when
          const response = await httpTestServer.request(
            'GET',
            '/api/organizations/1234/certification-attestations?division=3A'
          );

          // then
          expect(response.statusCode).to.equal(400);
        });
      });

      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('when no attestation are found', function () {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should resolve a 400 HTTP response', async function () {
          // given
          const division = '3b';
          securityPreHandlers.checkUserIsAdminInSCOOrganizationManagingStudents.returns(true);
          usecases.findCertificationAttestationsForDivision.rejects(
            new NoCertificationAttestationForDivisionError(division)
          );

          // when
          const response = await httpTestServer.request(
            'GET',
            '/api/organizations/1234/certification-attestations?division=3b&isFrenchDomainExtension=true'
          );

          // then
          const parsedPayload = JSON.parse(response.payload);
          expect(response.statusCode).to.equal(400);
          expect(parsedPayload.errors[0].detail).to.equal(
            `Aucune attestation de certification pour la classe ${division}.`
          );
        });
      });
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#getGroups', function () {
    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when the user is a member of the organization', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('returns organizations groups', async function () {
        const organizationId = 1234;
        securityPreHandlers.checkUserBelongsToSupOrganizationAndManagesStudents.returns(true);
        usecases.findGroupsByOrganization.withArgs({ organizationId }).resolves([{ name: 'G1' }]);

        const response = await httpTestServer.request('GET', `/api/organizations/${organizationId}/groups`);

        expect(response.statusCode).to.equal(200);
        expect(response.result.data).to.deep.equal([{ id: 'G1', type: 'groups', attributes: { name: 'G1' } }]);
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when the user is not a member of the organization', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('returns organizations groups', async function () {
        const organizationId = 1234;
        securityPreHandlers.checkUserBelongsToSupOrganizationAndManagesStudents.callsFake((request: $TSFixMe, h: $TSFixMe) => {
          return Promise.resolve(h.response().code(403).takeover());
        });
        const response = await httpTestServer.request('GET', `/api/organizations/${organizationId}/groups`);

        expect(response.statusCode).to.equal(403);
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when the organization id is invalid', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('returns organizations groups', async function () {
        const response = await httpTestServer.request('GET', `/api/organizations/ABC/groups`);

        expect(response.statusCode).to.equal(400);
      });
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#getDivisions', function () {
    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when the user is a member of the organization', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('returns organizations divisions', async function () {
        const organizationId = 1234;
        securityPreHandlers.checkUserBelongsToScoOrganizationAndManagesStudents.returns(true);
        usecases.findDivisionsByOrganization.withArgs({ organizationId }).resolves([{ name: 'G1' }]);

        const response = await httpTestServer.request('GET', `/api/organizations/${organizationId}/divisions`);

        expect(response.statusCode).to.equal(200);
        expect(response.result.data).to.deep.equal([{ id: 'G1', type: 'divisions', attributes: { name: 'G1' } }]);
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when the user is not a member of the organization', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('returns organizations divisions', async function () {
        const organizationId = 1234;
        securityPreHandlers.checkUserBelongsToScoOrganizationAndManagesStudents.callsFake((request: $TSFixMe, h: $TSFixMe) => {
          return Promise.resolve(h.response().code(403).takeover());
        });
        const response = await httpTestServer.request('GET', `/api/organizations/${organizationId}/divisions`);

        expect(response.statusCode).to.equal(403);
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when the organization id is invalid', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('returns returns an error 400', async function () {
        const response = await httpTestServer.request('GET', `/api/organizations/ABC/groups`);

        expect(response.statusCode).to.equal(400);
      });
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#getPaginatedParticipantsForAnOrganization', function () {
    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when the organization has participants', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('returns organization participants', async function () {
        const organizationId = 5678;
        usecases.getPaginatedParticipantsForAnOrganization
          .withArgs({ organizationId, page: {}, filters: {} })
          .resolves({
            organizationParticipants: [
              {
                id: 5678,
                firstName: 'Mei',
                lastName: 'Lee',
              },
            ],
            pagination: 1,
          });
        securityPreHandlers.checkUserBelongsToOrganization.returns(() => true);

        const response = await httpTestServer.request('GET', `/api/organizations/${organizationId}/participants`);

        expect(response.statusCode).to.equal(200);
        expect(response.result.data).to.deep.equal([
          {
            id: '5678',
            type: 'organization-participants',
            attributes: {
              'first-name': 'Mei',
              'last-name': 'Lee',
            },
          },
        ]);
      });
    });
  });
});
