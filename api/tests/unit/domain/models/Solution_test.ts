// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect } = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Solution'.
const Solution = require('../../../../lib/domain/models/Solution');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Domain | Models | Solution', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#enabledTreatments', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should contain nothing, when no treatments are set', function () {
      // given
      const solution = new Solution({ id: 'id' });

      // when
      const enabledTreatments = solution.enabledTreatments;

      // then
      expect(enabledTreatments).to.be.empty;
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should contain t1, when isT1Enabled is true', function () {
      // given
      const solution = new Solution({ id: 'id', isT1Enabled: true });

      // when
      const enabledTreatments = solution.enabledTreatments;

      // then
      expect(enabledTreatments).to.deep.equal(['t1']);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should contain t2, when isT2Enabled is true', function () {
      // given
      const solution = new Solution({ id: 'id', isT2Enabled: true });

      // when
      const enabledTreatments = solution.enabledTreatments;

      // then
      expect(enabledTreatments).to.deep.equal(['t2']);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should contain t3, when isT3Enabled is true', function () {
      // given
      const solution = new Solution({ id: 'id', isT3Enabled: true });

      // when
      const enabledTreatments = solution.enabledTreatments;

      // then
      expect(enabledTreatments).to.deep.equal(['t3']);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should contain t1, t2, t3, when isT1Enabled, isT2Enabled, isT3Enabled is true', function () {
      // given
      const solution = new Solution({ id: 'id', isT1Enabled: true, isT2Enabled: true, isT3Enabled: true });

      // when
      const enabledTreatments = solution.enabledTreatments;

      // then
      expect(enabledTreatments).to.deep.equal(['t1', 't2', 't3']);
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#deactivations', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return an deactivations.t1 = false when t1 is enabled ', function () {
      // given
      const solution = new Solution({ id: 'id', isT1Enabled: true });

      // when
      const deactivationsT1 = solution.deactivations.t1;

      // then
      expect(deactivationsT1).to.be.false;
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return an deactivations.t1 = true when t1 is not enabled ', function () {
      // given
      const solution = new Solution({ id: 'id', isT1Enabled: false });

      // when
      const deactivationsT1 = solution.deactivations.t1;

      // then
      expect(deactivationsT1).to.be.true;
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return an deactivations.t2 = false when t2 is enabled ', function () {
      // given
      const solution = new Solution({ id: 'id', isT2Enabled: true });

      // when
      const deactivationsT2 = solution.deactivations.t2;

      // then
      expect(deactivationsT2).to.be.false;
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return an deactivations.t2 = true when t2 is not enabled ', function () {
      // given
      const solution = new Solution({ id: 'id', isT2Enabled: false });

      // when
      const deactivationsT2 = solution.deactivations.t2;

      // then
      expect(deactivationsT2).to.be.true;
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return an deactivations.t3 = false when t3 is enabled ', function () {
      // given
      const solution = new Solution({ id: 'id', isT3Enabled: true });

      // when
      const deactivationsT3 = solution.deactivations.t3;

      // then
      expect(deactivationsT3).to.be.false;
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return an deactivations.t3 = true when t3 is not enabled ', function () {
      // given
      const solution = new Solution({ id: 'id', isT3Enabled: false });

      // when
      const deactivationsT3 = solution.deactivations.t3;

      // then
      expect(deactivationsT3).to.be.true;
    });
  });
});
