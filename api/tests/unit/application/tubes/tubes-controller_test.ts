// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, sinon } = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'usecases'.
const usecases = require('../../../../lib/domain/usecases');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'tubeContro... Remove this comment to see the full error message
const tubeController = require('../../../../lib/application/tubes/tube-controller');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'skillSeria... Remove this comment to see the full error message
const skillSerializer = require('../../../../lib/infrastructure/serializers/jsonapi/skill-serializer');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Controller | tubes-controller', function () {
  let skills: $TSFixMe;
  let serializedSkills: $TSFixMe;

  // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
  beforeEach(function () {
    skills = Symbol('skills');
    serializedSkills = Symbol('serializedSkills');

    sinon.stub(usecases, 'getTubeSkills').returns(skills);
    sinon.stub(skillSerializer, 'serialize').returns(serializedSkills);
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#listSkills', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return a list of skills', async function () {
      // given
      const request = {
        params: {
          id: 'tubeId',
        },
      };

      // when
      const result = await tubeController.listSkills(request);

      // then
      expect(result).to.equal(serializedSkills);
      expect(usecases.getTubeSkills).to.have.been.calledWith({ tubeId: 'tubeId' });
      expect(skillSerializer.serialize).to.have.been.calledWith(skills);
    });
  });
});
