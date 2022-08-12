// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, sinon, domainBuilder, HttpTestServer } = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'usecases'.
const usecases = require('../../../../lib/domain/usecases');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Membership... Remove this comment to see the full error message
const Membership = require('../../../../lib/domain/models/Membership');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'securityPr... Remove this comment to see the full error message
const securityPreHandlers = require('../../../../lib/application/security-pre-handlers');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'moduleUnde... Remove this comment to see the full error message
const moduleUnderTest = require('../../../../lib/application/memberships');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'InvalidMem... Remove this comment to see the full error message
const { InvalidMembershipOrganizationRoleError } = require('../../../../lib/domain/errors');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Integration | Application | Memberships | membership-controller', function () {
  let httpTestServer: $TSFixMe;

  // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
  beforeEach(async function () {
    sinon.stub(usecases, 'createMembership');
    sinon.stub(usecases, 'updateMembership');
    sinon.stub(usecases, 'createCertificationCenterMembershipForScoOrganizationMember');
    sinon.stub(usecases, 'disableMembership');
    sinon.stub(securityPreHandlers, 'adminMemberHasAtLeastOneAccessOf');
    sinon.stub(securityPreHandlers, 'checkUserIsAdminInOrganization');
    httpTestServer = new HttpTestServer();
    await httpTestServer.register(moduleUnderTest);
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#create', function () {
    const payload = {
      data: {
        type: 'memberships',
        relationships: {
          user: { data: { type: 'users', id: 1 } },
          organization: { data: { type: 'organizations', id: 1 } },
        },
      },
    };

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('Success cases', function () {
      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('when a certification center membership is created', function () {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should resolve a 201 HTTP response', async function () {
          // given
          const membership = domainBuilder.buildMembership();
          const certificationCenterMembership = domainBuilder.buildCertificationCenterMembership();

          usecases.createMembership.resolves(membership);
          usecases.createCertificationCenterMembershipForScoOrganizationMember
            .withArgs({ membership })
            .resolves(certificationCenterMembership);

          securityPreHandlers.adminMemberHasAtLeastOneAccessOf.returns(() => true);

          // when
          const response = await httpTestServer.request('POST', '/api/admin/memberships', payload);

          // then
          expect(response.statusCode).to.equal(201);
        });
      });

      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('when no certification center membership is created', function () {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should resolve a 201 HTTP response', async function () {
          // given
          const membership = domainBuilder.buildMembership();

          usecases.createMembership.resolves(membership);
          usecases.createCertificationCenterMembershipForScoOrganizationMember
            .withArgs({ membership })
            .resolves(undefined);

          securityPreHandlers.adminMemberHasAtLeastOneAccessOf.returns(() => true);

          // when
          const response = await httpTestServer.request('POST', '/api/admin/memberships', payload);

          // then
          expect(response.statusCode).to.equal(201);
        });
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return a JSON API membership', async function () {
        // given
        const membership = domainBuilder.buildMembership();
        usecases.createMembership.resolves(membership);

        securityPreHandlers.adminMemberHasAtLeastOneAccessOf.returns(() => true);

        // when
        const response = await httpTestServer.request('POST', '/api/admin/memberships', payload);

        // then
        expect(response.result.data.type).to.equal('memberships');
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
          const response = await httpTestServer.request('POST', '/api/admin/memberships', payload);

          // then
          expect(response.statusCode).to.equal(403);
        });
      });
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#update', function () {
    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('Success cases', function () {
      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('when a certification center membership is created', function () {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should return a 200 HTTP response', async function () {
          // given
          const membership = new Membership({
            id: 123,
            organizationRole: Membership.roles.ADMIN,
            updatedByUserId: null,
          });
          const updatedMembership = domainBuilder.buildMembership({
            organizationRole: Membership.roles.MEMBER,
          });
          const certificationCenterMembership = domainBuilder.buildCertificationCenterMembership();

          usecases.updateMembership.withArgs({ membership }).resolves(updatedMembership);
          usecases.createCertificationCenterMembershipForScoOrganizationMember
            .withArgs({ membership })
            .resolves(certificationCenterMembership);
          securityPreHandlers.checkUserIsAdminInOrganization.callsFake((request: $TSFixMe, h: $TSFixMe) => h.response(true));

          // when
          const payload = {
            data: {
              type: 'memberships',
              id: 123,
              attributes: {
                'organization-role': Membership.roles.ADMIN,
              },
              relationships: {
                organization: {
                  data: {
                    id: '1',
                    type: 'organizations',
                  },
                },
              },
            },
          };
          const response = await httpTestServer.request('PATCH', `/api/memberships/${membership.id}`, payload);

          // then
          expect(response.statusCode).to.equal(200);
        });
      });

      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('when no certification center membership is created', function () {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should return a 200 HTTP response', async function () {
          // given
          const membership = new Membership({
            id: 123,
            organizationRole: Membership.roles.ADMIN,
            updatedByUserId: null,
          });
          const updatedMembership = domainBuilder.buildMembership({
            organizationRole: Membership.roles.MEMBER,
          });
          usecases.updateMembership.withArgs({ membership }).resolves(updatedMembership);
          usecases.createCertificationCenterMembershipForScoOrganizationMember
            .withArgs({ membership })
            .resolves(undefined);
          securityPreHandlers.checkUserIsAdminInOrganization.callsFake((request: $TSFixMe, h: $TSFixMe) => h.response(true));

          // when
          const payload = {
            data: {
              type: 'memberships',
              id: 123,
              attributes: {
                'organization-role': Membership.roles.ADMIN,
              },
              relationships: {
                organization: {
                  data: {
                    id: '1',
                    type: 'organizations',
                  },
                },
              },
            },
          };
          const response = await httpTestServer.request('PATCH', `/api/memberships/${membership.id}`, payload);

          // then
          expect(response.statusCode).to.equal(200);
        });
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('Error cases', function () {
      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('when request is not valid', function () {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should resolve a 400 HTTP response', async function () {
          // given
          securityPreHandlers.checkUserIsAdminInOrganization.callsFake((request: $TSFixMe, h: $TSFixMe) => h.response(true));
          const idGivenInRequestParams = 1;
          const idGivenInPayload = 44;

          const membership = new Membership({
            id: idGivenInPayload,
            organizationRole: Membership.roles.ADMIN,
            updatedByUserId: null,
          });
          const updatedMembership = domainBuilder.buildMembership({
            organizationRole: Membership.roles.ADMIN,
          });
          usecases.updateMembership.withArgs({ membership }).resolves(updatedMembership);

          // when
          const payload = {
            data: {
              type: 'memberships',
              id: idGivenInPayload,
              attributes: {
                'organization-role': Membership.roles.ADMIN,
              },
              relationships: {
                organization: {
                  data: {
                    id: '1',
                    type: 'organizations',
                  },
                },
              },
            },
          };
          const response = await httpTestServer.request('PATCH', `/api/memberships/${idGivenInRequestParams}`, payload);

          // then
          expect(response.statusCode).to.equal(400);
        });
      });

      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('when organization role is not valid', function () {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should resolve a 400 HTTP response', async function () {
          // given
          securityPreHandlers.checkUserIsAdminInOrganization.callsFake((request: $TSFixMe, h: $TSFixMe) => h.response(true));
          usecases.updateMembership.throws(new InvalidMembershipOrganizationRoleError());

          // when
          const payload = {
            data: {
              type: 'memberships',
              attributes: {
                'organization-role': Membership.roles.ADMIN,
              },
              relationships: {
                organization: {
                  data: {
                    id: '1',
                    type: 'organizations',
                  },
                },
              },
            },
          };
          const response = await httpTestServer.request('PATCH', '/api/memberships/1', payload);

          // then
          expect(response.statusCode).to.equal(400);
        });
      });
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#disable', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return a 204 HTTP response', async function () {
      // given
      const membershipId = domainBuilder.buildMembership().id;
      usecases.disableMembership.resolves();
      securityPreHandlers.checkUserIsAdminInOrganization.callsFake((request: $TSFixMe, h: $TSFixMe) => h.response(true));

      // when
      const response = await httpTestServer.request('POST', `/api/memberships/${membershipId}/disable`);

      // then
      expect(response.statusCode).to.equal(204);
    });
  });
});
