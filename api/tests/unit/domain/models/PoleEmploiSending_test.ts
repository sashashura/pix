// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'PoleEmploi... Remove this comment to see the full error message
const PoleEmploiSending = require('../../../../lib/domain/models/PoleEmploiSending');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, domainBuilder } = require('../../../test-helper');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Domain | Models | PoleEmploiSending', function () {
  let expectedPoleEmploiSending: $TSFixMe;

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('buildForParticipationStarted', function () {
    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(function () {
      expectedPoleEmploiSending = domainBuilder.buildPoleEmploiSending({
        type: PoleEmploiSending.TYPES.CAMPAIGN_PARTICIPATION_START,
        payload: {},
      });
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should build a PoleEmploiSending', function () {
      // when
      const poleEmploiSending = PoleEmploiSending.buildForParticipationStarted({});

      // then
      expect(poleEmploiSending).to.be.instanceOf(PoleEmploiSending);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should build PoleEmploiSending with type CAMPAIGN_PARTICIPATION_START and given arguments', function () {
      // when
      const poleEmploiSending = PoleEmploiSending.buildForParticipationStarted({
        campaignParticipationId: expectedPoleEmploiSending.campaignParticipationId,
        payload: {},
        isSuccessful: expectedPoleEmploiSending.isSuccessful,
        responseCode: expectedPoleEmploiSending.responseCode,
      });

      // then
      expect(poleEmploiSending).to.deep.equal(expectedPoleEmploiSending);
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('buildForParticipationFinished', function () {
    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(function () {
      expectedPoleEmploiSending = domainBuilder.buildPoleEmploiSending({
        type: PoleEmploiSending.TYPES.CAMPAIGN_PARTICIPATION_COMPLETION,
        payload: {},
      });
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should build a PoleEmploiSending', function () {
      // when
      const poleEmploiSending = PoleEmploiSending.buildForParticipationFinished({});

      // then
      expect(poleEmploiSending).to.be.instanceOf(PoleEmploiSending);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should build PoleEmploiSending with type CAMPAIGN_PARTICIPATION_COMPLETION and given arguments', function () {
      // when
      const poleEmploiSending = PoleEmploiSending.buildForParticipationFinished({
        campaignParticipationId: expectedPoleEmploiSending.campaignParticipationId,
        payload: {},
        isSuccessful: expectedPoleEmploiSending.isSuccessful,
        responseCode: expectedPoleEmploiSending.responseCode,
      });

      // then
      expect(poleEmploiSending).to.deep.equal(expectedPoleEmploiSending);
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('buildForParticipationShared', function () {
    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(function () {
      expectedPoleEmploiSending = domainBuilder.buildPoleEmploiSending({
        type: PoleEmploiSending.TYPES.CAMPAIGN_PARTICIPATION_SHARING,
        payload: {},
      });
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should build a PoleEmploiSending', function () {
      // when
      const poleEmploiSending = PoleEmploiSending.buildForParticipationShared({});

      // then
      expect(poleEmploiSending).to.be.instanceOf(PoleEmploiSending);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should build PoleEmploiSending with type CAMPAIGN_PARTICIPATION_SHARING and given arguments', function () {
      // when
      const poleEmploiSending = PoleEmploiSending.buildForParticipationShared({
        campaignParticipationId: expectedPoleEmploiSending.campaignParticipationId,
        payload: {},
        isSuccessful: expectedPoleEmploiSending.isSuccessful,
        responseCode: expectedPoleEmploiSending.responseCode,
      });

      // then
      expect(poleEmploiSending).to.deep.equal(expectedPoleEmploiSending);
    });
  });
});
