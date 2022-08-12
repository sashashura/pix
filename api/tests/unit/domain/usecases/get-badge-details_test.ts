// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, sinon } = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'usecases'.
const usecases = require('../../../../lib/domain/usecases');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'BadgeWithL... Remove this comment to see the full error message
const BadgeWithLearningContent = require('../../../../lib/domain/models/BadgeWithLearningContent');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | UseCase | get-badge-details', function () {
  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('should get badge details', async function () {
    // given
    const badge = {
      skillSets: [
        {
          skillIds: [1, 2],
        },
      ],
    };
    const badgeId = Symbol('badge id');

    const skills = [{ tubeName: '@toto' }];
    const tubes: $TSFixMe = [];
    const locale = 'fr-fr';
    const expectedResult = new BadgeWithLearningContent({
      skills,
      badge,
      tubes,
    });

    const badgeRepository = {
      get: sinon.stub(),
    };
    badgeRepository.get.resolves(badge);

    const skillRepository = {
      findOperativeByIds: sinon.stub(),
    };
    skillRepository.findOperativeByIds.resolves(skills);

    const tubeRepository = {
      findByNames: sinon.stub(),
    };
    tubeRepository.findByNames.resolves(tubes);

    // when
    const response = await usecases.getBadgeDetails({
      badgeId,
      badgeRepository,
      skillRepository,
      tubeRepository,
    });

    // then
    expect(response).to.deep.equal(expectedResult);
    expect(badgeRepository.get).to.has.been.calledWith(badgeId);
    expect(skillRepository.findOperativeByIds).to.has.been.calledWith([1, 2]);
    expect(tubeRepository.findByNames).to.has.been.calledWith({ tubeNames: ['@toto'], locale });
  });
});
