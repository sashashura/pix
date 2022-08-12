// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, sinon, HttpTestServer } = require('../../../test-helper');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'usecases'.
const usecases = require('../../../../lib/domain/usecases');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'scoOrganiz... Remove this comment to see the full error message
const scoOrganizationInvitationSerializer = require('../../../../lib/infrastructure/serializers/jsonapi/sco-organization-invitation-serializer');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'moduleUnde... Remove this comment to see the full error message
const moduleUnderTest = require('../../../../lib/application/organization-invitations');

const {
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'AlreadyExi... Remove this comment to see the full error message
  AlreadyExistingOrganizationInvitationError,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'NotFoundEr... Remove this comment to see the full error message
  NotFoundError,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'UserNotFou... Remove this comment to see the full error message
  UserNotFoundError,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Organizati... Remove this comment to see the full error message
  OrganizationWithoutEmailError,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Organizati... Remove this comment to see the full error message
  OrganizationNotFoundError,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'ManyOrgani... Remove this comment to see the full error message
  ManyOrganizationsFoundError,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Organizati... Remove this comment to see the full error message
  OrganizationArchivedError,
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
} = require('../../../../lib/domain/errors');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Integration | Application | Organization-invitations | organization-invitation-controller', function () {
  let sandbox: $TSFixMe;
  let httpTestServer: $TSFixMe;

  // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
  beforeEach(async function () {
    sandbox = sinon.createSandbox();
    sandbox.stub(usecases, 'acceptOrganizationInvitation');
    sandbox.stub(usecases, 'sendScoInvitation');
    sandbox.stub(usecases, 'createCertificationCenterMembershipForScoOrganizationMember');
    sandbox.stub(scoOrganizationInvitationSerializer, 'serialize');

    httpTestServer = new HttpTestServer();
    await httpTestServer.register(moduleUnderTest);
  });

  // @ts-expect-error TS(2304): Cannot find name 'afterEach'.
  afterEach(function () {
    sandbox.restore();
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#acceptOrganizationInvitation', function () {
    const payload = {
      data: {
        id: '100047_DZWMP7L5UM',
        type: 'organization-invitation-responses',
        attributes: {
          code: 'DZWMP7L5UM',
          email: 'user@example.net',
        },
      },
    };

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('Success cases', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return an HTTP response with status code 204', async function () {
        // given
        usecases.acceptOrganizationInvitation.resolves();
        usecases.createCertificationCenterMembershipForScoOrganizationMember.resolves();

        // when
        const response = await httpTestServer.request('POST', '/api/organization-invitations/1/response', payload);

        // then
        expect(response.statusCode).to.equal(204);
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('Error cases', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should respond an HTTP response with status code 412 when AlreadyExistingOrganizationInvitationError', async function () {
        // given
        usecases.acceptOrganizationInvitation.rejects(new AlreadyExistingOrganizationInvitationError());

        // when
        const response = await httpTestServer.request('POST', '/api/organization-invitations/1/response', payload);

        // then
        expect(response.statusCode).to.equal(412);
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should respond an HTTP response with status code 404 when NotFoundError', async function () {
        // given
        // @ts-expect-error TS(2554): Expected 3 arguments, but got 0.
        usecases.acceptOrganizationInvitation.rejects(new NotFoundError());

        // when
        const response = await httpTestServer.request('POST', '/api/organization-invitations/1/response', payload);

        // then
        expect(response.statusCode).to.equal(404);
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should respond an HTTP response with status code 404 when UserNotFoundError', async function () {
        // given
        usecases.acceptOrganizationInvitation.rejects(new UserNotFoundError());

        // when
        const response = await httpTestServer.request('POST', '/api/organization-invitations/1/response', payload);

        // then
        expect(response.statusCode).to.equal(404);
      });
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#sendScoInvitation', function () {
    const uai = '1234567A';
    const payload = {
      data: {
        type: 'sco-organization-invitations',
        attributes: {
          uai,
          'first-name': 'john',
          'last-name': 'harry',
        },
      },
    };

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('Success cases', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return an HTTP response with status code 201', async function () {
        // given
        usecases.sendScoInvitation.resolves();

        // when
        const response = await httpTestServer.request('POST', '/api/organization-invitations/sco', payload);

        // then
        expect(response.statusCode).to.equal(201);
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('Error cases', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should respond an HTTP response with status code 404 when OrganizationNotFoundError', async function () {
        // given
        usecases.sendScoInvitation.rejects(new OrganizationNotFoundError());

        // when
        const response = await httpTestServer.request('POST', '/api/organization-invitations/sco', payload);

        // then
        expect(response.statusCode).to.equal(404);
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should respond an HTTP response with status code 412 when OrganizationWithoutEmailError', async function () {
        // given
        usecases.sendScoInvitation.rejects(new OrganizationWithoutEmailError());

        // when
        const response = await httpTestServer.request('POST', '/api/organization-invitations/sco', payload);

        // then
        expect(response.statusCode).to.equal(412);
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should respond an HTTP response with status code 409 when ManyOrganizationsFoundError', async function () {
        // given
        usecases.sendScoInvitation.rejects(new ManyOrganizationsFoundError());

        // when
        const response = await httpTestServer.request('POST', '/api/organization-invitations/sco', payload);

        // then
        expect(response.statusCode).to.equal(409);
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should respond an HTTP response with status code 422 when OrganizationArchivedError', async function () {
        // given
        usecases.sendScoInvitation.rejects(new OrganizationArchivedError());

        // when
        const response = await httpTestServer.request('POST', '/api/organization-invitations/sco', payload);

        // then
        expect(response.statusCode).to.equal(422);
      });
    });
  });
});
