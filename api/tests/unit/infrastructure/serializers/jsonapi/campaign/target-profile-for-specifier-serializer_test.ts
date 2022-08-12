// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, domainBuilder } = require('../../../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'serializer... Remove this comment to see the full error message
const serializer = require('../../../../../../lib/infrastructure/serializers/jsonapi/campaign/target-profile-for-specifier-serializer');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'TargetProf... Remove this comment to see the full error message
const TargetProfileForSpecifier = require('../../../../../../lib/domain/read-models/campaign/TargetProfileForSpecifier');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Serializer | JSONAPI | target-profile-for-specifier-serializer', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#serialize', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should serialize target profile to JSONAPI', function () {
      const skills = [domainBuilder.buildSkill({ tubeId: 'tube1' }), domainBuilder.buildSkill({ tubeId: 'tube2' })];
      const thematicResults = [domainBuilder.buildBadge()];

      const targetProfile = new TargetProfileForSpecifier({
        id: 132,
        name: 'name',
        skills,
        thematicResults,
        hasStage: true,
        description: 'description',
        category: 'SUBJECT',
      });

      const meta = { some: 'meta' };

      const expectedTargetProfile = {
        data: {
          id: targetProfile.id.toString(),
          type: 'target-profiles',
          attributes: {
            name: 'name',
            'tube-count': 2,
            'thematic-result-count': 1,
            'has-stage': true,
            description: 'description',
            category: 'SUBJECT',
          },
        },
        meta,
      };

      const serializedTargetProfile = serializer.serialize(targetProfile, meta);

      return expect(serializedTargetProfile).to.deep.equal(expectedTargetProfile);
    });
  });
});
