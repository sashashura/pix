// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, sinon, databaseBuilder, knex } = require('../../../test-helper');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const attachOrganizationsToTargetProfile = require('../../../../lib/domain/usecases/attach-organizations-to-target-profile');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'organizati... Remove this comment to see the full error message
const organizationsToAttachToTargetProfileRepository = require('../../../../lib/infrastructure/repositories/organizations-to-attach-to-target-profile-repository');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'skillDatas... Remove this comment to see the full error message
const skillDatasource = require('../../../../lib/infrastructure/datasources/learning-content/skill-datasource');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Integration | UseCase | attach-organizations-to-target-profile', function () {
  // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
  beforeEach(function () {
    sinon.stub(skillDatasource, 'findOperativeByRecordIds').resolves([]);
  });
  // @ts-expect-error TS(2304): Cannot find name 'afterEach'.
  afterEach(function () {
    return knex('target-profile-shares').delete();
  });
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#attachOrganizationsToTargetProfile', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('attaches organization to target profile', async function () {
      const targetProfile = databaseBuilder.factory.buildTargetProfile();
      const organization1 = databaseBuilder.factory.buildOrganization();
      const organization2 = databaseBuilder.factory.buildOrganization();
      await databaseBuilder.commit();

      const organizationIds = [organization1.id, organization2.id];

      await attachOrganizationsToTargetProfile({
        targetProfileId: targetProfile.id,
        organizationIds,
        organizationsToAttachToTargetProfileRepository,
      });

      const rows = await knex('target-profile-shares')
        .select('organizationId')
        .where({ targetProfileId: targetProfile.id });
      const organizationIdsWithTargetProfile = rows.map(({
        organizationId
      }: $TSFixMe) => organizationId);

      expect(organizationIdsWithTargetProfile).to.exactlyContain(organizationIds);
    });
  });
});
