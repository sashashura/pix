// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, sinon, domainBuilder, HttpTestServer } = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'usecases'.
const usecases = require('../../../../lib/domain/usecases');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'securityPr... Remove this comment to see the full error message
const securityPreHandlers = require('../../../../lib/application/security-pre-handlers');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const targetProfilesRouter = require('../../../../lib/application/target-profiles');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'NotFoundEr... Remove this comment to see the full error message
const { NotFoundError } = require('../../../../lib/domain/errors');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Integration | Application | Route | target-profile-router', function () {
  let httpTestServer: $TSFixMe;
  // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
  beforeEach(async function () {
    httpTestServer = new HttpTestServer();
    await httpTestServer.register(targetProfilesRouter);
    sinon.stub(securityPreHandlers, 'adminMemberHasAtLeastOneAccessOf').returns(() => true);
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('GET api/admin/target-profiles/{id}', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return a target profile', async function () {
      // given
      const targetProfile = domainBuilder.buildTargetProfileWithLearningContent({
        id: 1,
        name: 'target-profile',
        createdAt: '2021-04-30',
        outdated: '2024-05-23',
        isPublic: false,
        ownerOrganizationId: 2,
        description: 'description',
        comment: 'comment',
        imageUrl: 'imageUrl',
        skills: [],
        tubes: [],
        competences: [],
        areas: [],
        isSimplifiedAccess: false,
      });

      sinon
        .stub(usecases, 'getTargetProfileDetails')
        .withArgs({ targetProfileId: targetProfile.id })
        .resolves(targetProfile);

      // when
      const response = await httpTestServer.request('GET', `/api/admin/target-profiles/${targetProfile.id}`);

      // then
      expect(response.statusCode).to.equal(200);
      expect(response.result.data.id).to.equal('1');
      expect(response.result.data.attributes).to.deep.equal({
        name: 'target-profile',
        'created-at': '2021-04-30',
        outdated: '2024-05-23',
        'is-public': false,
        'owner-organization-id': 2,
        description: 'description',
        category: 'OTHER',
        comment: 'comment',
        'image-url': 'imageUrl',
        'is-simplified-access': false,
        'tubes-selection': [],
      });
    });

    // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
    describe('when target profile id is not found', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return 404 status code', async function () {
        // given
        // @ts-expect-error TS(2554): Expected 3 arguments, but got 0.
        sinon.stub(usecases, 'getTargetProfileDetails').withArgs({ targetProfileId: 666 }).rejects(new NotFoundError());

        // when
        const response = await httpTestServer.request('GET', `/api/admin/target-profiles/666`);

        // then
        expect(response.statusCode).to.equal(404);
      });
    });
  });
});
