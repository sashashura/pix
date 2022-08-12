// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'domainBuil... Remove this comment to see the full error message
const { domainBuilder, expect, sinon } = require('../../../../test-helper');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'CampaignPr... Remove this comment to see the full error message
const CampaignProfilesCollectionResultLine = require('../../../../../lib/infrastructure/exports/campaigns/campaign-profiles-collection-result-line');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'PlacementP... Remove this comment to see the full error message
const PlacementProfile = require('../../../../../lib/domain/models/PlacementProfile');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'getI18n'.
const { getI18n } = require('../../../../tooling/i18n/i18n');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Serializer | CSV | campaign-profiles-collection-result-line', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#toCsvLine', function () {
    let organization: $TSFixMe, campaign: $TSFixMe, competences: $TSFixMe;

    // TODO: Fix this the next time the file is edited.
    // eslint-disable-next-line mocha/no-setup-in-describe
    const translate = getI18n().__;

    const placementProfile = new PlacementProfile({
      userId: 123,
      userCompetences: [
        {
          id: 'recCompetence1',
          pixScore: 9,
          estimatedLevel: 1,
        },
        {
          id: 'recCompetence2',
          pixScore: 4,
          estimatedLevel: 0,
        },
      ],
    });

    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(function () {
      const listSkills1 = domainBuilder.buildSkillCollection({ name: '@web', minLevel: 1, maxLevel: 5 });
      const listSkills2 = domainBuilder.buildSkillCollection({ name: '@url', minLevel: 1, maxLevel: 2 });

      organization = {};
      campaign = {};

      competences = [
        {
          id: 'recCompetence1',
          name: 'Competence1',
          skillIds: listSkills1.map((skill: $TSFixMe) => skill.id),
        },
        {
          id: 'recCompetence2',
          name: 'Competence2',
          skillIds: listSkills2.map((skill: $TSFixMe) => skill.id),
        },
      ];
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when user share his result', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return the complete line with 0 certifiable competence and non certifiable', async function () {
        //given
        sinon.stub(PlacementProfile.prototype, 'isCertifiable').returns(false);
        sinon.stub(PlacementProfile.prototype, 'getCertifiableCompetencesCount').returns(0);

        campaign.id = 123;
        campaign.name = 'test';
        organization.name = 'Umbrella';

        const campaignParticipationResultData = {
          id: 1,
          isShared: true,
          isCompleted: true,
          createdAt: new Date('2019-02-25T10:00:00Z'),
          sharedAt: new Date('2019-03-01T23:04:05Z'),
          userId: 123,
          participantFirstName: 'Juan',
          participantLastName: 'Carlitos',
          pixScore: 13,
        };

        const csvExcpectedLine =
          `"${organization.name}";` +
          `${campaign.id};` +
          `"${campaign.name}";` +
          `"${campaignParticipationResultData.participantLastName}";` +
          `"${campaignParticipationResultData.participantFirstName}";` +
          '"Oui";' +
          '2019-03-01;' +
          '13;' +
          '"Non";' +
          '0;' +
          '1;' +
          '9;' +
          '0;' +
          '4' +
          '\n';

        //when
        const line = new CampaignProfilesCollectionResultLine(
          campaign,
          organization,
          campaignParticipationResultData,
          competences,
          placementProfile,
          translate
        );

        //then
        expect(line.toCsvLine()).to.equal(csvExcpectedLine);
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return the complete line with 5 certifiable competence', async function () {
        //given
        sinon.stub(PlacementProfile.prototype, 'isCertifiable').returns(true);
        sinon.stub(PlacementProfile.prototype, 'getCertifiableCompetencesCount').returns(5);

        campaign.id = 123;
        campaign.name = 'test';
        organization.name = 'Umbrella';

        const campaignParticipationResultData = {
          id: 1,
          isShared: true,
          isCompleted: true,
          createdAt: new Date('2019-02-25T10:00:00Z'),
          sharedAt: new Date('2019-03-01T23:04:05Z'),
          userId: 123,
          participantFirstName: 'Juan',
          participantLastName: 'Carlitos',
          pixScore: 13,
        };

        const csvExcpectedLine =
          `"${organization.name}";` +
          `${campaign.id};` +
          `"${campaign.name}";` +
          `"${campaignParticipationResultData.participantLastName}";` +
          `"${campaignParticipationResultData.participantFirstName}";` +
          '"Oui";' +
          '2019-03-01;' +
          '13;' +
          '"Oui";' +
          '5;' +
          '1;' +
          '9;' +
          '0;' +
          '4' +
          '\n';

        //when
        const line = new CampaignProfilesCollectionResultLine(
          campaign,
          organization,
          campaignParticipationResultData,
          competences,
          placementProfile,
          translate
        );

        //then
        expect(line.toCsvLine()).to.equal(csvExcpectedLine);
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when user has not share his result yet', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return the complete line with 5 certifiable competences', async function () {
        //given
        sinon.stub(PlacementProfile.prototype, 'isCertifiable').returns(true);
        sinon.stub(PlacementProfile.prototype, 'getCertifiableCompetencesCount').returns(5);

        campaign.id = 123;
        campaign.name = 'test';
        organization.name = 'Umbrella';

        const campaignParticipationResultData = {
          id: 1,
          isShared: false,
          isCompleted: true,
          createdAt: new Date('2019-02-25T10:00:00Z'),
          sharedAt: new Date('2019-03-01T23:04:05Z'),
          participantExternalId: '-Mon mail pro',
          userId: 123,
          participantFirstName: 'Juan',
          participantLastName: 'Carlitos',
        };

        const csvExcpectedLine =
          `"${organization.name}";` +
          `${campaign.id};` +
          `"${campaign.name}";` +
          `"${campaignParticipationResultData.participantLastName}";` +
          `"${campaignParticipationResultData.participantFirstName}";` +
          '"Non";' +
          '"NA";' +
          '"NA";' +
          '"NA";' +
          '"NA";' +
          '"NA";' +
          '"NA";' +
          '"NA";' +
          '"NA"' +
          '\n';

        //when
        const line = new CampaignProfilesCollectionResultLine(
          campaign,
          organization,
          campaignParticipationResultData,
          competences,
          placementProfile,
          translate
        );

        //then
        expect(line.toCsvLine()).to.equal(csvExcpectedLine);
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('When campaign has an idPixLabel', function () {
      // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
      beforeEach(function () {
        campaign.idPixLabel = 'Mail Pro';
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return the line with a participant external id', function () {
        //given
        sinon.stub(PlacementProfile.prototype, 'isCertifiable').returns(true);
        sinon.stub(PlacementProfile.prototype, 'getCertifiableCompetencesCount').returns(5);

        campaign.id = 123;
        campaign.name = 'test';
        organization.name = 'Umbrella';

        const campaignParticipationResultData = {
          id: 1,
          isShared: false,
          isCompleted: true,
          createdAt: new Date('2019-02-25T10:00:00Z'),
          sharedAt: new Date('2019-03-01T23:04:05Z'),
          participantExternalId: 'mailpro@pro.net',
          userId: 123,
          participantFirstName: 'Juan',
          participantLastName: 'Carlitos',
        };

        const csvExcpectedLine =
          `"${organization.name}";` +
          `${campaign.id};` +
          `"${campaign.name}";` +
          `"${campaignParticipationResultData.participantLastName}";` +
          `"${campaignParticipationResultData.participantFirstName}";` +
          `"${campaignParticipationResultData.participantExternalId}";` +
          '"Non";' +
          '"NA";' +
          '"NA";' +
          '"NA";' +
          '"NA";' +
          '"NA";' +
          '"NA";' +
          '"NA";' +
          '"NA"' +
          '\n';

        //when
        const line = new CampaignProfilesCollectionResultLine(
          campaign,
          organization,
          campaignParticipationResultData,
          competences,
          placementProfile,
          translate
        );

        //then
        expect(line.toCsvLine()).to.equal(csvExcpectedLine);
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('When organization is PRO', function () {
      // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
      beforeEach(function () {
        organization.isPro = true;
        organization.isManagingStudents = false;
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return the csv without student number or division information', function () {
        //given
        sinon.stub(PlacementProfile.prototype, 'isCertifiable').returns(false);
        sinon.stub(PlacementProfile.prototype, 'getCertifiableCompetencesCount').returns(0);

        campaign.id = 123;
        campaign.name = 'test';
        organization.name = 'Umbrella';

        const campaignParticipationResultData = {
          id: 1,
          isShared: true,
          isCompleted: true,
          createdAt: new Date('2019-02-25T10:00:00Z'),
          sharedAt: new Date('2019-03-01T23:04:05Z'),
          userId: 123,
          participantFirstName: 'Juan',
          participantLastName: 'Carlitos',
          division: '5me',
          studentNumber: 'studentNumber',
          pixScore: 13,
        };

        const csvExcpectedLine =
          `"${organization.name}";` +
          `${campaign.id};` +
          `"${campaign.name}";` +
          `"${campaignParticipationResultData.participantLastName}";` +
          `"${campaignParticipationResultData.participantFirstName}";` +
          '"Oui";' +
          '2019-03-01;' +
          '13;' +
          '"Non";' +
          '0;' +
          '1;' +
          '9;' +
          '0;' +
          '4' +
          '\n';

        //when
        const line = new CampaignProfilesCollectionResultLine(
          campaign,
          organization,
          campaignParticipationResultData,
          competences,
          placementProfile,
          translate
        );

        //then
        expect(line.toCsvLine()).to.equal(csvExcpectedLine);
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('When organization is SCO and managing students', function () {
      // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
      beforeEach(function () {
        organization.isSco = true;
        organization.isManagingStudents = true;
      });

      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('when the participant does not have a division', function () {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should return the csv with empty division', function () {
          //given
          sinon.stub(PlacementProfile.prototype, 'isCertifiable').returns(false);
          sinon.stub(PlacementProfile.prototype, 'getCertifiableCompetencesCount').returns(0);

          campaign.id = 123;
          campaign.name = 'test';
          organization.name = 'Umbrella';

          const campaignParticipationResultData = {
            id: 1,
            isShared: true,
            isCompleted: true,
            createdAt: new Date('2019-02-25T10:00:00Z'),
            sharedAt: new Date('2019-03-01T23:04:05Z'),
            userId: 123,
            participantFirstName: 'Juan',
            participantLastName: 'Carlitos',
            division: null,
            pixScore: 13,
          };

          const csvExcpectedLine =
            `"${organization.name}";` +
            `${campaign.id};` +
            `"${campaign.name}";` +
            `"${campaignParticipationResultData.participantLastName}";` +
            `"${campaignParticipationResultData.participantFirstName}";` +
            '"";' +
            '"Oui";' +
            '2019-03-01;' +
            '13;' +
            '"Non";' +
            '0;' +
            '1;' +
            '9;' +
            '0;' +
            '4' +
            '\n';

          //when
          const line = new CampaignProfilesCollectionResultLine(
            campaign,
            organization,
            campaignParticipationResultData,
            competences,
            placementProfile,
            translate
          );

          //then
          expect(line.toCsvLine()).to.equal(csvExcpectedLine);
        });
      });

      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('when the participant has a division', function () {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should return the csv with division information', function () {
          //given
          sinon.stub(PlacementProfile.prototype, 'isCertifiable').returns(false);
          sinon.stub(PlacementProfile.prototype, 'getCertifiableCompetencesCount').returns(0);

          campaign.id = 123;
          campaign.name = 'test';
          organization.name = 'Umbrella';

          const campaignParticipationResultData = {
            id: 1,
            isShared: true,
            isCompleted: true,
            createdAt: new Date('2019-02-25T10:00:00Z'),
            sharedAt: new Date('2019-03-01T23:04:05Z'),
            userId: 123,
            participantFirstName: 'Juan',
            participantLastName: 'Carlitos',
            division: '3eme',
            pixScore: 13,
          };

          const csvExcpectedLine =
            `"${organization.name}";` +
            `${campaign.id};` +
            `"${campaign.name}";` +
            `"${campaignParticipationResultData.participantLastName}";` +
            `"${campaignParticipationResultData.participantFirstName}";` +
            `"${campaignParticipationResultData.division}";` +
            '"Oui";' +
            '2019-03-01;' +
            '13;' +
            '"Non";' +
            '0;' +
            '1;' +
            '9;' +
            '0;' +
            '4' +
            '\n';

          //when
          const line = new CampaignProfilesCollectionResultLine(
            campaign,
            organization,
            campaignParticipationResultData,
            competences,
            placementProfile,
            translate
          );

          //then
          expect(line.toCsvLine()).to.equal(csvExcpectedLine);
        });
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('When organization is SCO and not managing students', function () {
      // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
      beforeEach(function () {
        organization.isSco = true;
        organization.isManagingStudents = false;
      });

      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('when the participant has a division', function () {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should return the line without division information', async function () {
          //given
          sinon.stub(PlacementProfile.prototype, 'isCertifiable').returns(true);
          sinon.stub(PlacementProfile.prototype, 'getCertifiableCompetencesCount').returns(5);

          campaign.id = 123;
          campaign.name = 'test';
          organization.name = 'Umbrella';

          const campaignParticipationResultData = {
            id: 1,
            isShared: false,
            isCompleted: true,
            createdAt: new Date('2019-02-25T10:00:00Z'),
            sharedAt: new Date('2019-03-01T23:04:05Z'),
            participantExternalId: '-Mon mail pro',
            userId: 123,
            participantFirstName: 'Juan',
            participantLastName: 'Carlitos',
            division: '3eme',
          };

          const csvExcpectedLine =
            `"${organization.name}";` +
            `${campaign.id};` +
            `"${campaign.name}";` +
            `"${campaignParticipationResultData.participantLastName}";` +
            `"${campaignParticipationResultData.participantFirstName}";` +
            '"Non";' +
            '"NA";' +
            '"NA";' +
            '"NA";' +
            '"NA";' +
            '"NA";' +
            '"NA";' +
            '"NA";' +
            '"NA"' +
            '\n';

          //when
          const line = new CampaignProfilesCollectionResultLine(
            campaign,
            organization,
            campaignParticipationResultData,
            competences,
            placementProfile,
            translate
          );

          //then
          expect(line.toCsvLine()).to.equal(csvExcpectedLine);
        });
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('When organization is SUP and managing students', function () {
      // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
      beforeEach(function () {
        organization.isSup = true;
        organization.isManagingStudents = true;
      });

      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('when the participant does not have a student number', function () {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should return the csv with empty student number and group', function () {
          //given
          sinon.stub(PlacementProfile.prototype, 'isCertifiable').returns(false);
          sinon.stub(PlacementProfile.prototype, 'getCertifiableCompetencesCount').returns(0);

          campaign.id = 123;
          campaign.name = 'test';
          organization.name = 'Umbrella';

          const campaignParticipationResultData = {
            id: 1,
            isShared: true,
            isCompleted: true,
            createdAt: new Date('2019-02-25T10:00:00Z'),
            sharedAt: new Date('2019-03-01T23:04:05Z'),
            userId: 123,
            participantFirstName: 'Juan',
            participantLastName: 'Carlitos',
            studentNumber: null,
            pixScore: 13,
            group: '',
          };

          const csvExcpectedLine =
            `"${organization.name}";` +
            `${campaign.id};` +
            `"${campaign.name}";` +
            `"${campaignParticipationResultData.participantLastName}";` +
            `"${campaignParticipationResultData.participantFirstName}";` +
            `"${campaignParticipationResultData.group}";` +
            '"";' +
            '"Oui";' +
            '2019-03-01;' +
            '13;' +
            '"Non";' +
            '0;' +
            '1;' +
            '9;' +
            '0;' +
            '4' +
            '\n';

          //when
          const line = new CampaignProfilesCollectionResultLine(
            campaign,
            organization,
            campaignParticipationResultData,
            competences,
            placementProfile,
            translate
          );

          //then
          expect(line.toCsvLine()).to.equal(csvExcpectedLine);
        });
      });

      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('when the participant has a student number', function () {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should return the csv with student number information', function () {
          //given
          sinon.stub(PlacementProfile.prototype, 'isCertifiable').returns(false);
          sinon.stub(PlacementProfile.prototype, 'getCertifiableCompetencesCount').returns(0);

          campaign.id = 123;
          campaign.name = 'test';
          organization.name = 'Umbrella';

          const campaignParticipationResultData = {
            id: 1,
            isShared: true,
            isCompleted: true,
            createdAt: new Date('2019-02-25T10:00:00Z'),
            sharedAt: new Date('2019-03-01T23:04:05Z'),
            userId: 123,
            participantFirstName: 'Juan',
            participantLastName: 'Carlitos',
            studentNumber: 'HELLO123',
            pixScore: 13,
            group: 'NA',
          };

          const csvExcpectedLine =
            `"${organization.name}";` +
            `${campaign.id};` +
            `"${campaign.name}";` +
            `"${campaignParticipationResultData.participantLastName}";` +
            `"${campaignParticipationResultData.participantFirstName}";` +
            `"${campaignParticipationResultData.group}";` +
            `"${campaignParticipationResultData.studentNumber}";` +
            '"Oui";' +
            '2019-03-01;' +
            '13;' +
            '"Non";' +
            '0;' +
            '1;' +
            '9;' +
            '0;' +
            '4' +
            '\n';

          //when
          const line = new CampaignProfilesCollectionResultLine(
            campaign,
            organization,
            campaignParticipationResultData,
            competences,
            placementProfile,
            translate
          );

          //then
          expect(line.toCsvLine()).to.equal(csvExcpectedLine);
        });
      });

      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('when the participant has a group', function () {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should return the csv with group information', function () {
          //given
          sinon.stub(PlacementProfile.prototype, 'isCertifiable').returns(false);
          sinon.stub(PlacementProfile.prototype, 'getCertifiableCompetencesCount').returns(0);

          campaign.id = 123;
          campaign.name = 'test';
          organization.name = 'Umbrella';

          const campaignParticipationResultData = {
            id: 1,
            isShared: true,
            isCompleted: true,
            createdAt: new Date('2019-02-25T10:00:00Z'),
            sharedAt: new Date('2019-03-01T23:04:05Z'),
            userId: 123,
            participantFirstName: 'Juan',
            participantLastName: 'Carlitos',
            studentNumber: 'HELLO123',
            pixScore: 13,
            group: 'groupix',
          };

          const csvExcpectedLine =
            `"${organization.name}";` +
            `${campaign.id};` +
            `"${campaign.name}";` +
            `"${campaignParticipationResultData.participantLastName}";` +
            `"${campaignParticipationResultData.participantFirstName}";` +
            `"${campaignParticipationResultData.group}";` +
            `"${campaignParticipationResultData.studentNumber}";` +
            '"Oui";' +
            '2019-03-01;' +
            '13;' +
            '"Non";' +
            '0;' +
            '1;' +
            '9;' +
            '0;' +
            '4' +
            '\n';

          //when
          const line = new CampaignProfilesCollectionResultLine(
            campaign,
            organization,
            campaignParticipationResultData,
            competences,
            placementProfile,
            translate
          );

          //then
          expect(line.toCsvLine()).to.equal(csvExcpectedLine);
        });
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('When organization is SUP and not managing students', function () {
      // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
      beforeEach(function () {
        organization.isSup = true;
        organization.isManagingStudents = false;
      });

      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('when the participant has a student number', function () {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should return the line without student number information', async function () {
          //given
          sinon.stub(PlacementProfile.prototype, 'isCertifiable').returns(true);
          sinon.stub(PlacementProfile.prototype, 'getCertifiableCompetencesCount').returns(5);

          campaign.id = 123;
          campaign.name = 'test';
          organization.name = 'Umbrella';

          const campaignParticipationResultData = {
            id: 1,
            isShared: false,
            isCompleted: true,
            createdAt: new Date('2019-02-25T10:00:00Z'),
            sharedAt: new Date('2019-03-01T23:04:05Z'),
            participantExternalId: '-Mon mail pro',
            userId: 123,
            participantFirstName: 'Juan',
            participantLastName: 'Carlitos',
            studentNumber: 'goodBoï',
          };

          const csvExcpectedLine =
            `"${organization.name}";` +
            `${campaign.id};` +
            `"${campaign.name}";` +
            `"${campaignParticipationResultData.participantLastName}";` +
            `"${campaignParticipationResultData.participantFirstName}";` +
            '"Non";' +
            '"NA";' +
            '"NA";' +
            '"NA";' +
            '"NA";' +
            '"NA";' +
            '"NA";' +
            '"NA";' +
            '"NA"' +
            '\n';

          //when
          const line = new CampaignProfilesCollectionResultLine(
            campaign,
            organization,
            campaignParticipationResultData,
            competences,
            placementProfile,
            translate
          );

          //then
          expect(line.toCsvLine()).to.equal(csvExcpectedLine);
        });
      });
    });
  });
});
