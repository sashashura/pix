// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, domainBuilder } = require('../../../test-helper');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | chai-custom-helpers | deepEqualArray', function () {
  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('should fail assertion when compared objects are not arrays', function () {
    // @ts-expect-error TS(2304): Cannot find name 'global'.
    global.chaiErr(function () {
      expect([]).to.deepEqualArray('coucou');
    }, "expected 'String' to equal 'Array'");
    // @ts-expect-error TS(2304): Cannot find name 'global'.
    global.chaiErr(function () {
      expect('coucou').to.deepEqualArray([]);
    }, "expected 'String' to equal 'Array'");
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('should fail assertion when compared arrays have not the same length', function () {
    // @ts-expect-error TS(2304): Cannot find name 'global'.
    global.chaiErr(function () {
      expect([1, 2, 3]).to.deepEqualArray([1, 2]);
    }, 'expected 3 to equal 2');
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('should fail assertion when compared values of array are not of the same instance', function () {
    // @ts-expect-error TS(2304): Cannot find name 'global'.
    global.chaiErr(function () {
      expect([1]).to.deepEqualArray(['coucou']);
    }, "expected 'Number' to equal 'String'");
    // @ts-expect-error TS(2304): Cannot find name 'global'.
    global.chaiErr(function () {
      expect([domainBuilder.buildAnswer()]).to.deepEqualArray([domainBuilder.buildUser()]);
    }, "expected 'Answer' to equal 'User'");
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('should fail assertion when compared values of array have not the same content', function () {
    // @ts-expect-error TS(2304): Cannot find name 'global'.
    global.chaiErr(function () {
      expect([1]).to.deepEqualArray([3]);
    }, 'expected 1 to deeply equal 3');
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('should succeed assertion when compared arrays have the same values in order', function () {
    // given
    const skillSet = domainBuilder.buildSkillSet({
      id: 123,
      name: 'someName',
      skillIds: ['recABC', 'recDEF'],
    });
    const sameSkillSet = domainBuilder.buildSkillSet({
      id: 123,
      name: 'someName',
      skillIds: ['recABC', 'recDEF'],
    });
    const campaign = domainBuilder.buildCampaign();

    // then
    expect([skillSet, campaign]).to.deepEqualArray([sameSkillSet, campaign]);
  });
});
