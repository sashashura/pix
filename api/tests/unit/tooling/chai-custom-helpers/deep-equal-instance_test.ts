// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, domainBuilder } = require('../../../test-helper');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | chai-custom-helpers | deepEqualInstance', function () {
  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('should fail assertion when both objects are not of the same instance', function () {
    // given
    const answer = domainBuilder.buildAnswer();
    const campaign = domainBuilder.buildCampaign();
    const answerDTO = { ...answer };

    // when / then
    // @ts-expect-error TS(2304): Cannot find name 'global'.
    global.chaiErr(function () {
      expect(campaign).to.deepEqualInstance(answer);
    }, "expected 'Campaign' to equal 'Answer'");
    // @ts-expect-error TS(2304): Cannot find name 'global'.
    global.chaiErr(function () {
      expect(answerDTO).to.deepEqualInstance(answer);
    }, "expected 'Object' to equal 'Answer'");
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('should fail assertion when both objects have not the same content', function () {
    // given
    const skillSet = domainBuilder.buildSkillSet({
      id: 123,
      name: 'someName',
      skillIds: ['recABC', 'recDEF'],
    });
    const otherSkillSet = domainBuilder.buildSkillSet({
      id: 124,
      name: 'someName',
      skillIds: ['recABC', 'recDEF'],
    });
    const anotherSkillSet = domainBuilder.buildSkillSet({
      id: 123,
      name: 'name',
      skillIds: ['recUVW', 'recXYZ'],
    });

    // when/then
    // @ts-expect-error TS(2304): Cannot find name 'global'.
    global.chaiErr(
      function () {
        expect(otherSkillSet).to.deepEqualInstance(skillSet);
      },
      {
        actual: otherSkillSet,
        expected: skillSet,
        operator: 'deepStrictEqual',
      }
    );
    // @ts-expect-error TS(2304): Cannot find name 'global'.
    global.chaiErr(
      function () {
        expect(anotherSkillSet).to.deepEqualInstance(skillSet);
      },
      {
        actual: anotherSkillSet,
        expected: skillSet,
        operator: 'deepStrictEqual',
      }
    );
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('should succeed assertion when both objects have the same type and content, regardless of the reference', function () {
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

    // then
    expect(skillSet).to.deepEqualInstance(skillSet);
    expect(skillSet).to.deepEqualInstance(sameSkillSet);
  });
});
