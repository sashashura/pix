// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect } = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'CampaignPa... Remove this comment to see the full error message
const CampaignParticipationInfo = require('../../../../lib/domain/read-models/CampaignParticipationInfo');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'ObjectVali... Remove this comment to see the full error message
const { ObjectValidationError } = require('../../../../lib/domain/errors');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Domain | Read-models | CampaignParticipationInfo', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#constructor', function () {
    let validArguments: $TSFixMe;
    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(function () {
      validArguments = {
        participantFirstName: 'Mariah',
        participantLastName: 'Carey',
        participantExternalId: 'Christmas1990',
        studentNumber: 'SuperEtudiant',
        userId: 123,
        campaignParticipationId: 999,
        isCompleted: true,
        createdAt: new Date('2019-04-01'),
        sharedAt: new Date('2019-05-01'),
        masteryPercentage: 1,
      };
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should successfully instantiate object when passing all valid arguments', function () {
      // when
      expect(() => new CampaignParticipationInfo(validArguments)).not.to.throw(ObjectValidationError);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should throw an ObjectValidationError when participantFirstName is not valid', function () {
      // when
      expect(() => new CampaignParticipationInfo({ ...validArguments, participantFirstName: 123456 })).to.throw(
        ObjectValidationError
      );
      expect(() => new CampaignParticipationInfo({ ...validArguments, participantFirstName: undefined })).to.throw(
        ObjectValidationError
      );
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should not throw an ObjectValidationError when participantFirstname is empty', function () {
      // when
      expect(() => new CampaignParticipationInfo({ ...validArguments, participantFirstName: '' })).not.to.throw(
        ObjectValidationError
      );
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should throw an ObjectValidationError when participantLastName is not valid', function () {
      // when
      expect(() => new CampaignParticipationInfo({ ...validArguments, participantLastName: 123456 })).to.throw(
        ObjectValidationError
      );
      expect(() => new CampaignParticipationInfo({ ...validArguments, participantLastName: undefined })).to.throw(
        ObjectValidationError
      );
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should not throw an ObjectValidationError when participantLastName is empty', function () {
      // when
      expect(() => new CampaignParticipationInfo({ ...validArguments, participantLastName: '' })).not.to.throw(
        ObjectValidationError
      );
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should throw an ObjectValidationError when participantExternalId is not valid', function () {
      // when
      expect(() => new CampaignParticipationInfo({ ...validArguments, participantExternalId: 123456 })).to.throw(
        ObjectValidationError
      );
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should not throw an ObjectValidationError when participantExternalId is null or undefined', function () {
      // when
      expect(() => new CampaignParticipationInfo({ ...validArguments, participantExternalId: null })).not.to.throw(
        ObjectValidationError
      );
      expect(() => new CampaignParticipationInfo({ ...validArguments, participantExternalId: undefined })).not.to.throw(
        ObjectValidationError
      );
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should throw an ObjectValidationError when studentNumber is not valid', function () {
      // when
      expect(() => new CampaignParticipationInfo({ ...validArguments, studentNumber: 123456 })).to.throw(
        ObjectValidationError
      );
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should not throw an ObjectValidationError when studentNumber is null or undefined', function () {
      // when
      expect(() => new CampaignParticipationInfo({ ...validArguments, studentNumber: null })).not.to.throw(
        ObjectValidationError
      );
      expect(() => new CampaignParticipationInfo({ ...validArguments, studentNumber: undefined })).not.to.throw(
        ObjectValidationError
      );
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should throw an ObjectValidationError when userId is not valid', function () {
      // when
      expect(() => new CampaignParticipationInfo({ ...validArguments, userId: 'les zouzous' })).to.throw(
        ObjectValidationError
      );
      expect(() => new CampaignParticipationInfo({ ...validArguments, userId: undefined })).to.throw(
        ObjectValidationError
      );
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should throw an ObjectValidationError when isCompleted is not valid', function () {
      // when
      expect(() => new CampaignParticipationInfo({ ...validArguments, isCompleted: 'les zouzous' })).to.throw(
        ObjectValidationError
      );
      expect(() => new CampaignParticipationInfo({ ...validArguments, isCompleted: undefined })).to.throw(
        ObjectValidationError
      );
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should throw an ObjectValidationError when createdAt is not valid', function () {
      // when
      expect(() => new CampaignParticipationInfo({ ...validArguments, createdAt: 'coucou' })).to.throw(
        ObjectValidationError
      );
      expect(() => new CampaignParticipationInfo({ ...validArguments, createdAt: undefined })).to.throw(
        ObjectValidationError
      );
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should throw an ObjectValidationError when sharedAt is not valid', function () {
      // when
      expect(() => new CampaignParticipationInfo({ ...validArguments, sharedAt: 'coucou' })).to.throw(
        ObjectValidationError
      );
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should not throw an ObjectValidationError when sharedAt is null', function () {
      // when
      expect(() => new CampaignParticipationInfo({ ...validArguments, sharedAt: null })).not.to.throw(
        ObjectValidationError
      );
    });

    // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
    describe('masteryRate', function () {
      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('when the masteryRate is null', function () {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should return null for the masteryRate', function () {
          // when
          const campaignParticipationInfo = new CampaignParticipationInfo({ ...validArguments, masteryRate: null });

          // then
          expect(campaignParticipationInfo.masteryRate).to.equal(null);
        });
      });

      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('when the masteryRate is undefined', function () {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should return null for the masteryRate', function () {
          // when
          const campaignParticipationInfo = new CampaignParticipationInfo({
            ...validArguments,
            masteryRate: undefined,
          });

          // then
          expect(campaignParticipationInfo.masteryRate).to.equal(null);
        });
      });

      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('when the masteryRate equals to 0', function () {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should return 0 for the masteryRate', function () {
          // when
          const campaignParticipationInfo = new CampaignParticipationInfo({
            ...validArguments,
            masteryRate: 0,
          });

          // then
          expect(campaignParticipationInfo.masteryRate).to.equal(0);
        });
      });

      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('when the masteryRate is a string', function () {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should return the number for the masteryRate', function () {
          // when
          const campaignParticipationInfo = new CampaignParticipationInfo({
            ...validArguments,
            masteryRate: '0.75',
          });

          // then
          expect(campaignParticipationInfo.masteryRate).to.equal(0.75);
        });
      });
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#get isShared()', function () {
    let validArguments: $TSFixMe;

    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(function () {
      validArguments = {
        participantFirstName: 'Mariah',
        participantLastName: 'Carey',
        participantExternalId: 'Christmas1990',
        userId: 123,
        campaignParticipationId: 999,
        isCompleted: true,
        createdAt: new Date('2019-04-01'),
        masteryPercentage: 1,
      };
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return true', function () {
      // given
      const campaignParticipationInfo = new CampaignParticipationInfo({
        ...validArguments,
        sharedAt: new Date('2020-01-01'),
      });

      // when / then
      expect(campaignParticipationInfo.isShared).to.be.true;
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return false', function () {
      // given
      const campaignParticipationInfo = new CampaignParticipationInfo({
        ...validArguments,
        sharedAt: null,
      });

      // when / then
      expect(campaignParticipationInfo.isShared).to.be.false;
    });
  });
});
