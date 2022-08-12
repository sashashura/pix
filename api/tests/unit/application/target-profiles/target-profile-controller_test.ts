// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, sinon, hFake } = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'targetProf... Remove this comment to see the full error message
const targetProfileController = require('../../../../lib/application/target-profiles/target-profile-controller');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'usecases'.
const usecases = require('../../../../lib/domain/usecases');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'targetProf... Remove this comment to see the full error message
const targetProfileAttachOrganizationSerializer = require('../../../../lib/infrastructure/serializers/jsonapi/target-profile-attach-organization-serializer');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Controller | target-profile-controller', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#updateTargetProfile', function () {
    let request: $TSFixMe;

    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(function () {
      sinon.stub(usecases, 'updateTargetProfile');

      request = {
        params: {
          id: 123,
        },
        payload: {
          data: {
            attributes: {
              name: 'Pixer123',
              description: 'description changée',
              comment: 'commentaire changée',
            },
          },
        },
      };
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('successful case', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should succeed', async function () {
        // when
        const response = await targetProfileController.updateTargetProfile(request, hFake);

        // then
        expect(response.statusCode).to.equal(204);
        expect(usecases.updateTargetProfile).to.have.been.calledOnce;
        expect(usecases.updateTargetProfile).to.have.been.calledWithMatch({
          id: 123,
          name: 'Pixer123',
          description: 'description changée',
          comment: 'commentaire changée',
        });
      });
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#attachOrganizations', function () {
    let request: $TSFixMe;

    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(function () {
      sinon.stub(usecases, 'attachOrganizationsToTargetProfile');
      sinon.stub(targetProfileAttachOrganizationSerializer, 'serialize');

      request = {
        params: {
          id: 123,
        },
        payload: {
          'organization-ids': 1,
        },
      };
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('successful case', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should succeed', async function () {
        // when
        const serializer = Symbol('targetProfileAttachOrganizationsSerializer');
        usecases.attachOrganizationsToTargetProfile.resolves();
        targetProfileAttachOrganizationSerializer.serialize.returns(serializer);

        const response = await targetProfileController.attachOrganizations(request, hFake);
        // then
        expect(targetProfileAttachOrganizationSerializer.serialize).to.have.been.called;
        expect(response.statusCode).to.equal(200);
        expect(response.source).to.equal(serializer);
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should call usecase', async function () {
        // when
        await targetProfileController.attachOrganizations(request, hFake);

        // then
        expect(usecases.attachOrganizationsToTargetProfile).to.have.been.calledOnce;
        expect(usecases.attachOrganizationsToTargetProfile).to.have.been.calledWithMatch({
          targetProfileId: 123,
          organizationIds: 1,
        });
      });
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#attachOrganizationsFromExistingTargetProfile', function () {
    let request: $TSFixMe;

    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(function () {
      sinon.stub(usecases, 'attachOrganizationsFromExistingTargetProfile');

      request = {
        params: {
          id: 123,
        },
        payload: {
          'target-profile-id': 1,
        },
      };
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('successful case', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should succeed', async function () {
        // when
        const response = await targetProfileController.attachOrganizationsFromExistingTargetProfile(request, hFake);

        // then
        expect(response.statusCode).to.equal(204);
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should call usecase', async function () {
        // when
        await targetProfileController.attachOrganizationsFromExistingTargetProfile(request, hFake);

        // then
        expect(usecases.attachOrganizationsFromExistingTargetProfile).to.have.been.calledOnce;
        expect(usecases.attachOrganizationsFromExistingTargetProfile).to.have.been.calledWithMatch({
          targetProfileId: 123,
          existingTargetProfileId: 1,
        });
      });
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#outdateTargetProfile', function () {
    let request: $TSFixMe;

    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(function () {
      sinon.stub(usecases, 'outdateTargetProfile');

      request = {
        params: {
          id: 123,
        },
      };
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('successful case', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should succeed', async function () {
        // when
        const response = await targetProfileController.outdateTargetProfile(request, hFake);

        // then
        expect(response.statusCode).to.equal(204);
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should outdate target profile', async function () {
        // when
        await targetProfileController.outdateTargetProfile(request, hFake);

        // then
        expect(usecases.outdateTargetProfile).to.have.been.calledWithMatch({ id: 123 });
      });
    });
  });
});
