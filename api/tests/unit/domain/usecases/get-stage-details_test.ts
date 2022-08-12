// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, sinon } = require('../../../test-helper');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const { getStageDetails } = require('../../../../lib/domain/usecases');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | UseCase | get-stage-details', function () {
  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('should call repository method to get all details of a stage', async function () {
    //given
    const stageRepository = {
      get: sinon.stub(),
    };
    const id = 44;
    //when
    await getStageDetails({ stageId: 44, stageRepository });

    //then
    expect(stageRepository.get).to.have.been.calledOnceWithExactly(id);
  });
});
