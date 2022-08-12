// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, sinon } = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'usecases'.
const usecases = require('../../../../lib/domain/usecases');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | UseCase | get-tube-skills', function () {
  let skillRepository: $TSFixMe, expectedSkillsResult: $TSFixMe;

  // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
  beforeEach(function () {
    expectedSkillsResult = [{ id: 'skillId1' }, { id: 'skillId2' }];

    skillRepository = {
      findActiveByTubeId: sinon.stub().resolves(expectedSkillsResult),
    };
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('should get skills by tube', async function () {
    // given
    const tubeId = 'tubeId';

    // when
    const response = await usecases.getTubeSkills({
      skillRepository,
      tubeId,
    });

    // then
    expect(skillRepository.findActiveByTubeId).to.have.been.calledWith(tubeId);
    expect(response).to.deep.equal(expectedSkillsResult);
  });
});
