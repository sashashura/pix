// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, domainBuilder } = require('../../../test-helper');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Domain | Models | Campaign', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#organizationId', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return id of the organization', function () {
      // given
      const campaign = domainBuilder.buildCampaign.ofTypeAssessment();

      // when
      const organizationId = campaign.organizationId;

      // then
      expect(organizationId).to.equal(campaign.organization.id);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return null if campaign has no organization', function () {
      // given
      const campaign = domainBuilder.buildCampaign.ofTypeProfilesCollection({ organization: null });

      // when
      const organizationId = campaign.organizationId;

      // then
      expect(organizationId).to.equal(null);
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#targetProfileId', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return id of the targetProfile', function () {
      // given
      const campaign = domainBuilder.buildCampaign.ofTypeAssessment();

      // when
      const targetProfileId = campaign.targetProfileId;

      // then
      expect(targetProfileId).to.equal(campaign.targetProfile.id);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return null if campaign has no targetProfile', function () {
      // given
      const campaign = domainBuilder.buildCampaign.ofTypeProfilesCollection();

      // when
      const targetProfileId = campaign.targetProfileId;

      // then
      expect(targetProfileId).to.equal(null);
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('isAssessment', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return true when campaign is of type assessment', function () {
      // given
      const campaign = domainBuilder.buildCampaign.ofTypeAssessment();

      // when / then
      expect(campaign.isAssessment()).to.be.true;
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return false when campaign is not of type assessment', function () {
      // given
      const campaign = domainBuilder.buildCampaign.ofTypeProfilesCollection();

      // when / then
      expect(campaign.isAssessment()).to.be.false;
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('isProfilesCollection', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return true when campaign is of type profiles collection', function () {
      // given
      const campaign = domainBuilder.buildCampaign.ofTypeProfilesCollection();

      // when / then
      expect(campaign.isProfilesCollection()).to.be.true;
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return false when campaign is not of type profiles collection', function () {
      // given
      const campaign = domainBuilder.buildCampaign.ofTypeAssessment();

      // when / then
      expect(campaign.isProfilesCollection()).to.be.false;
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('isArchived', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return true when campaign is archived', function () {
      // given
      const campaign = domainBuilder.buildCampaign({ archivedAt: new Date('1990-01-04') });

      // when / then
      expect(campaign.isArchived()).to.be.true;
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return false when campaign is not of type profiles collection', function () {
      // given
      const campaign = domainBuilder.buildCampaign({ archivedAt: null });

      // when / then
      expect(campaign.isArchived()).to.be.false;
    });
  });
});
