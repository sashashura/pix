// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect } = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Complement... Remove this comment to see the full error message
const ComplementaryCertificationCourseResultsForJuryCertification = require('../../../../lib/domain/read-models/ComplementaryCertificationCourseResultsForJuryCertification');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'PIX_EMPLOI... Remove this comment to see the full error message
const { PIX_EMPLOI_CLEA_V1, PIX_EMPLOI_CLEA_V2, PIX_EMPLOI_CLEA_V3, PIX_DROIT_MAITRE_CERTIF, PIX_DROIT_EXPERT_CERTIF } =
  // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
  require('../../../../lib/domain/models/Badge').keys;

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Domain | Models | ComplementaryCertificationCourseResultsForJuryCertification', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#label', function () {
    // eslint-disable-next-line mocha/no-setup-in-describe
    [
      { partnerKey: PIX_EMPLOI_CLEA_V1, expectedLabel: 'CléA Numérique' },
      { partnerKey: PIX_EMPLOI_CLEA_V2, expectedLabel: 'CléA Numérique' },
      { partnerKey: PIX_EMPLOI_CLEA_V3, expectedLabel: 'CléA Numérique' },
      { partnerKey: PIX_DROIT_MAITRE_CERTIF, expectedLabel: 'Pix+ Droit Maître' },
      { partnerKey: PIX_DROIT_EXPERT_CERTIF, expectedLabel: 'Pix+ Droit Expert' },
    ].forEach(({ partnerKey, expectedLabel }) => {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it(`should return ${expectedLabel} for partner key ${partnerKey}`, function () {
        // given
        const complementaryCertificationCourseResultsForJuryCertification =
          new ComplementaryCertificationCourseResultsForJuryCertification({ partnerKey });

        // when
        const label = complementaryCertificationCourseResultsForJuryCertification.label;

        // then
        expect(label).to.equal(expectedLabel);
      });
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#status', function () {
    // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
    describe('when the complementary certification course result is acquired', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return Validée', function () {
        // given
        const complementaryCertificationCourseResultsForJuryCertification =
          new ComplementaryCertificationCourseResultsForJuryCertification({ acquired: true });

        // when
        const status = complementaryCertificationCourseResultsForJuryCertification.status;

        // then
        expect(status).to.equal('Validée');
      });
    });

    // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
    describe('when the complementary certification course result is not acquired', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return Rejetée', function () {
        // given
        const complementaryCertificationCourseResultsForJuryCertification =
          new ComplementaryCertificationCourseResultsForJuryCertification({ acquired: false });

        // when
        const status = complementaryCertificationCourseResultsForJuryCertification.status;

        // then
        expect(status).to.equal('Rejetée');
      });
    });
  });
});
