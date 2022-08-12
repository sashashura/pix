// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, databaseBuilder } = require('../../../test-helper');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const divisionRepository = require('../../../../lib/infrastructure/repositories/division-repository');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Integration | Repository | Division', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#findByCampaignId', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('returns the division from organization learner associated to the given campaign', async function () {
      const division1 = '6emeB';
      const division2 = '3emeA';
      const campaign = databaseBuilder.factory.buildCampaign();

      databaseBuilder.factory.buildCampaignParticipationWithOrganizationLearner(
        { organizationId: campaign.organizationId, division: division1 },
        { campaignId: campaign.id }
      );
      databaseBuilder.factory.buildCampaignParticipationWithOrganizationLearner(
        { organizationId: campaign.organizationId, division: division2 },
        { campaignId: campaign.id }
      );
      await databaseBuilder.commit();

      const divisions = await divisionRepository.findByCampaignId(campaign.id);

      expect(divisions).to.deep.equal([{ name: '3emeA' }, { name: '6emeB' }]);
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when several participants have the same division', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('returns each division one time', async function () {
        const division = '5eme1';
        const campaign = databaseBuilder.factory.buildCampaign();

        databaseBuilder.factory.buildCampaignParticipationWithOrganizationLearner(
          { organizationId: campaign.organizationId, division: division },
          { campaignId: campaign.id }
        );
        databaseBuilder.factory.buildCampaignParticipationWithOrganizationLearner(
          { organizationId: campaign.organizationId, division: division },
          { campaignId: campaign.id }
        );
        await databaseBuilder.commit();

        const divisions = await divisionRepository.findByCampaignId(campaign.id);

        expect(divisions).to.deep.equal([{ name: '5eme1' }]);
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when participants has no division', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('returns empty array', async function () {
        const division = null;
        const campaign = databaseBuilder.factory.buildCampaign();

        databaseBuilder.factory.buildCampaignParticipationWithOrganizationLearner(
          { organizationId: campaign.organizationId, division: division },
          { campaignId: campaign.id }
        );
        await databaseBuilder.commit();

        const divisions = await divisionRepository.findByCampaignId(campaign.id);

        expect(divisions).to.deep.equal([]);
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when participation is deleted', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should not return the division of the deleted campaignParticipation', async function () {
        const division = '5eme1';
        const campaign = databaseBuilder.factory.buildCampaign();

        databaseBuilder.factory.buildCampaignParticipationWithOrganizationLearner(
          { organizationId: campaign.organizationId, division: division },
          { campaignId: campaign.id, deletedAt: '2020-01-22' }
        );

        await databaseBuilder.commit();

        const divisions = await divisionRepository.findByCampaignId(campaign.id);

        expect(divisions).to.deep.equal([]);
      });
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#findByOrganizationIdForCurrentSchoolYear', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return list of divisions from an organization ordered by name', async function () {
      // given
      const organization = databaseBuilder.factory.buildOrganization();

      databaseBuilder.factory.buildOrganizationLearner({
        organizationId: organization.id,
        division: '5A',
      });
      databaseBuilder.factory.buildOrganizationLearner({
        organizationId: organization.id,
        division: '_3A',
      });
      databaseBuilder.factory.buildOrganizationLearner({
        organizationId: organization.id,
        division: '3A',
      });
      databaseBuilder.factory.buildOrganizationLearner({
        organizationId: organization.id,
        division: 'T2',
      });
      databaseBuilder.factory.buildOrganizationLearner({
        organizationId: organization.id,
        division: 't1',
      });
      databaseBuilder.factory.buildOrganizationLearner({
        organizationId: organization.id,
        division: 't1',
      });

      await databaseBuilder.commit();

      // when
      const divisions = await divisionRepository.findByOrganizationIdForCurrentSchoolYear({
        organizationId: organization.id,
      });

      // then
      expect(divisions).to.have.lengthOf(5);
      expect(divisions).to.deep.equal([
        { name: '3A' },
        { name: '5A' },
        { name: 'T2' },
        { name: '_3A' },
        { name: 't1' },
      ]);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return list of divisions from the given organization', async function () {
      const organization = databaseBuilder.factory.buildOrganization();

      databaseBuilder.factory.buildOrganizationLearner({
        organizationId: organization.id,
        division: '5A',
      });
      databaseBuilder.factory.buildOrganizationLearner({
        division: '5B',
      });

      await databaseBuilder.commit();

      const divisions = await divisionRepository.findByOrganizationIdForCurrentSchoolYear({
        organizationId: organization.id,
      });

      expect(divisions).to.deep.equal([{ name: '5A' }]);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should omit divisions for organization learner disabled', async function () {
      const organization = databaseBuilder.factory.buildOrganization();

      databaseBuilder.factory.buildOrganizationLearner({
        organizationId: organization.id,
        division: '5A',
        isDisabled: false,
      });
      databaseBuilder.factory.buildOrganizationLearner({
        organizationId: organization.id,
        division: '5B',
        isDisabled: true,
      });

      await databaseBuilder.commit();

      const divisions = await divisionRepository.findByOrganizationIdForCurrentSchoolYear({
        organizationId: organization.id,
      });

      expect(divisions).to.deep.equal([{ name: '5A' }]);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('returns nothing if the organization learner has no division', async function () {
      const organization = databaseBuilder.factory.buildOrganization();

      databaseBuilder.factory.buildOrganizationLearner({
        organizationId: organization.id,
        division: null,
        isDisabled: false,
      });

      await databaseBuilder.commit();

      const divisions = await divisionRepository.findByOrganizationIdForCurrentSchoolYear({
        organizationId: organization.id,
      });

      expect(divisions).to.be.empty;
    });
  });
});
