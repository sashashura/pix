// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect } = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'CampaignPr... Remove this comment to see the full error message
const CampaignProfile = require('../../../../lib/domain/read-models/CampaignProfile');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'CampaignPa... Remove this comment to see the full error message
const CampaignParticipationStatuses = require('../../../../lib/domain/models/CampaignParticipationStatuses');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'SHARED'.
const { SHARED, TO_SHARE } = CampaignParticipationStatuses;

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Domain | Read-Models | CampaignProfile', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#isCertifiable', function () {
    // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
    describe('when the  campaign participation is shared', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('compute the number of certifiable competence', function () {
        const placementProfile = { isCertifiable: () => true };

        const campaignProfile = new CampaignProfile({ status: SHARED, placementProfile });

        expect(campaignProfile.isCertifiable).to.equal(true);
      });
    });
    // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
    describe('when the campaign participation is not Shared', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('does not give information about certification status', function () {
        const placementProfile = { isCertifiable: () => true };

        const campaignProfile = new CampaignProfile({ status: TO_SHARE, placementProfile });

        expect(campaignProfile.isCertifiable).to.equal(null);
      });
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#certifiableCompetencesCount', function () {
    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when the campaign participation is shared', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('compute the number of certifiable competence', function () {
        const placementProfile = { getCertifiableCompetencesCount: () => 2 };

        const campaignProfile = new CampaignProfile({ status: SHARED, placementProfile });

        expect(campaignProfile.certifiableCompetencesCount).to.equal(2);
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when the campaign participation is not shared', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('does not compute the number of certifiable competences', function () {
        const placementProfile = { getCertifiableCompetencesCount: () => 2 };

        const campaignProfile = new CampaignProfile({ status: TO_SHARE, placementProfile });

        expect(campaignProfile.certifiableCompetencesCount).to.equal(null);
      });
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#competencesCount', function () {
    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when the campaign participation is shared', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('compute the number of competence', function () {
        const placementProfile = { getCompetencesCount: () => 3 };

        const campaignProfile = new CampaignProfile({ status: SHARED, placementProfile });

        expect(campaignProfile.competencesCount).to.equal(3);
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when the campaign participation is not shared', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('does not compute the number of competence', function () {
        const placementProfile = { getCompetencesCount: () => 2 };

        const campaignProfile = new CampaignProfile({ status: TO_SHARE, placementProfile });

        expect(campaignProfile.competencesCount).to.equal(null);
      });
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#competences', function () {
    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when the campaign participation is shared', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('returns user competences', function () {
        const competence = {
          id: 1,
          name: 'competence1',
          pixScore: 1,
          estimatedLevel: 1,
          area: { color: 'blue' },
          index: '1.1',
        };
        const placementProfile = { userCompetences: [competence] };

        const campaignProfile = new CampaignProfile({ status: SHARED, placementProfile });

        expect(campaignProfile.competences).to.deep.equal([
          {
            id: 1,
            name: 'competence1',
            pixScore: 1,
            estimatedLevel: 1,
            areaColor: 'blue',
            index: '1.1',
          },
        ]);
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when the campaign participation is not shared', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('does not compute the number of competence', function () {
        const placementProfile = { userCompetences: [{ name: 'competence1' }] };

        const campaignProfile = new CampaignProfile({ status: TO_SHARE, placementProfile });

        expect(campaignProfile.competences).to.be.empty;
      });
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#firstName', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('returns the user first name', function () {
      const params = { firstName: 'John' };

      const campaignProfile = new CampaignProfile(params);

      expect(campaignProfile.firstName).to.equal('John');
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#lastName', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('returns the user last name', function () {
      const params = { lastName: 'Wick' };

      const campaignProfile = new CampaignProfile(params);

      expect(campaignProfile.lastName).to.equal('Wick');
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#campaignParticipationId', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('returns the campaignParticipationId', function () {
      const params = { campaignParticipationId: 12 };

      const campaignProfile = new CampaignProfile(params);

      expect(campaignProfile.campaignParticipationId).to.equal(12);
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#campaignId', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('returns the campaignId', function () {
      const params = { campaignId: 11 };

      const campaignProfile = new CampaignProfile(params);

      expect(campaignProfile.campaignId).to.equal(11);
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#externalId', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('returns the externalId', function () {
      const params = { participantExternalId: 'BabaYaga' };

      const campaignProfile = new CampaignProfile(params);

      expect(campaignProfile.externalId).to.equal('BabaYaga');
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#sharedAt', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('returns the sharing date', function () {
      const params = { sharedAt: new Date('2020-01-01') };

      const campaignProfile = new CampaignProfile(params);

      expect(campaignProfile.sharedAt).to.deep.equal(new Date('2020-01-01'));
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#createdAt', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('returns the creation date', function () {
      const params = { createdAt: new Date('2020-01-02') };

      const campaignProfile = new CampaignProfile(params);

      expect(campaignProfile.createdAt).to.deep.equal(new Date('2020-01-02'));
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#pixScore', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('returns the pixScore', function () {
      const params = { pixScore: 768 };

      const campaignProfile = new CampaignProfile(params);

      expect(campaignProfile.pixScore).to.equal(768);
    });
  });
});
