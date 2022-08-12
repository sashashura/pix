// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'serializer... Remove this comment to see the full error message
const serializer = require('../../../../../lib/infrastructure/serializers/jsonapi/skill-set-serializer');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect } = require('../../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'SkillSet'.
const SkillSet = require('../../../../../lib/domain/models/SkillSet');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Serializer | JSONAPI | skill-set-serializer', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#serialize', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should convert a SkillSet model object into JSON API data', function () {
      // given
      const skillSet = new SkillSet({
        name: 'Mon SkillSet',
        skillIds: ['recSkill1', 'recSkill2'],
      });

      // when
      const serializedSkillSet = serializer.serialize(skillSet);

      // then
      const expectedSkillSet = {
        data: {
          type: 'skill-sets',
          attributes: {
            name: 'Mon SkillSet',
            'skill-ids': ['recSkill1', 'recSkill2'],
          },
        },
      };

      expect(serializedSkillSet).to.deep.equal(expectedSkillSet);
    });
  });
});
