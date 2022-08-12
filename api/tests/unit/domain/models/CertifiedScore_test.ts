// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect } = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'CertifiedS... Remove this comment to see the full error message
const { CertifiedScore } = require('../../../../lib/domain/models/CertifiedScore');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'CertifiedL... Remove this comment to see the full error message
const { CertifiedLevel } = require('../../../../lib/domain/models/CertifiedLevel');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'PIX_COUNT_... Remove this comment to see the full error message
const { PIX_COUNT_BY_LEVEL } = require('../../../../lib/domain/constants');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Domain | Models | CertifiedScore', function () {
  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('is equal to the estimated score if the estimated level is certified', function () {
    // when
    const certifiedScore = CertifiedScore.from({
      certifiedLevel: CertifiedLevel.validate(3),
      estimatedScore: 10,
    });

    // then
    expect(certifiedScore.value).to.equal(10);
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it(`is reduced by ${PIX_COUNT_BY_LEVEL} pix if the estimated level is downgraded`, function () {
    // when
    const certifiedScore = CertifiedScore.from({
      certifiedLevel: CertifiedLevel.downgrade(3),
      estimatedScore: 10,
    });

    // then
    expect(certifiedScore.value).to.equal(10 - PIX_COUNT_BY_LEVEL);
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('is equal to 0 if the estimated level is uncertified', function () {
    // when
    const certifiedScore = CertifiedScore.from({
      certifiedLevel: CertifiedLevel.invalidate(),
      estimatedScore: 10,
    });

    // then
    expect(certifiedScore.value).to.equal(0);
  });
});
