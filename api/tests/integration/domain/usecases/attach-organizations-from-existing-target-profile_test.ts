// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, sinon, databaseBuilder, knex, catchErr } = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'NoOrganiza... Remove this comment to see the full error message
const { NoOrganizationToAttach, NotFoundError } = require('../../../../lib/domain/errors');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const attachOrganizationsFromExistingTargetProfile = require('../../../../lib/domain/usecases/attach-organizations-from-existing-target-profile');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'organizati... Remove this comment to see the full error message
const organizationsToAttachToTargetProfileRepository = require('../../../../lib/infrastructure/repositories/organizations-to-attach-to-target-profile-repository');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'targetProf... Remove this comment to see the full error message
const targetProfileRepository = require('../../../../lib/infrastructure/repositories/target-profile-repository');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'skillDatas... Remove this comment to see the full error message
const skillDatasource = require('../../../../lib/infrastructure/datasources/learning-content/skill-datasource');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Integration | UseCase | attach-organizations-from-existing-target-profile', function () {
  // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
  beforeEach(function () {
    sinon.stub(skillDatasource, 'findOperativeByRecordIds').resolves([]);
  });
  // @ts-expect-error TS(2304): Cannot find name 'afterEach'.
  afterEach(function () {
    return knex('target-profile-shares').delete();
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#attachOrganizationsFromExistingTargetProfile', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('attaches organizations to target profile with given existing target profile', async function () {
      const existingTargetProfileId = databaseBuilder.factory.buildTargetProfile().id;
      const targetProfileId = databaseBuilder.factory.buildTargetProfile().id;
      const organizationId1 = databaseBuilder.factory.buildOrganization().id;
      const organizationId2 = databaseBuilder.factory.buildOrganization().id;
      databaseBuilder.factory.buildTargetProfileShare({
        targetProfileId: existingTargetProfileId,
        organizationId: organizationId1,
      });
      databaseBuilder.factory.buildTargetProfileShare({
        targetProfileId: existingTargetProfileId,
        organizationId: organizationId2,
      });
      await databaseBuilder.commit();

      const expectedOrganizationIds = [organizationId1, organizationId2];

      await attachOrganizationsFromExistingTargetProfile({
        targetProfileId,
        existingTargetProfileId,
        organizationsToAttachToTargetProfileRepository,
        targetProfileRepository,
      });

      const rows = await knex('target-profile-shares').select('organizationId').where({ targetProfileId });
      const organizationIds = rows.map(({
        organizationId
      }: $TSFixMe) => organizationId);

      expect(organizationIds).to.exactlyContain(expectedOrganizationIds);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('throws error when no organizations to attach', async function () {
      const existingTargetProfileId = databaseBuilder.factory.buildTargetProfile().id;
      const targetProfileId = databaseBuilder.factory.buildTargetProfile().id;
      await databaseBuilder.commit();

      // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
      const error = await catchErr(attachOrganizationsFromExistingTargetProfile)({
        targetProfileId,
        existingTargetProfileId,
        organizationsToAttachToTargetProfileRepository,
        targetProfileRepository,
      });

      expect(error).to.be.instanceOf(NoOrganizationToAttach);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('throws error when new target profile does not exist', async function () {
      const existingTargetProfileId = databaseBuilder.factory.buildTargetProfile().id;
      const organizationId = databaseBuilder.factory.buildOrganization().id;
      databaseBuilder.factory.buildTargetProfileShare({ targetProfileId: existingTargetProfileId, organizationId });
      await databaseBuilder.commit();

      // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
      const error = await catchErr(attachOrganizationsFromExistingTargetProfile)({
        targetProfileId: 999,
        existingTargetProfileId,
        organizationsToAttachToTargetProfileRepository,
        targetProfileRepository,
      });

      expect(error).to.be.instanceOf(NotFoundError);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('throws error when old target profile does not exist', async function () {
      const targetProfileId = databaseBuilder.factory.buildTargetProfile().id;
      await databaseBuilder.commit();

      // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
      const error = await catchErr(attachOrganizationsFromExistingTargetProfile)({
        targetProfileId,
        existingTargetProfileId: 999,
        organizationsToAttachToTargetProfileRepository,
        targetProfileRepository,
      });

      expect(error).to.be.instanceOf(NotFoundError);
    });
  });
});
