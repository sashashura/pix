// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, sinon } = require('../../../test-helper');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const { updateStage } = require('../../../../lib/domain/usecases');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | UseCase | update-stage', function () {
  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('should call repository method to update prescriberTitle and prescriberDescription for a stage', async function () {
    //given
    const stageRepository = {
      updateStage: sinon.stub(),
    };

    //when
    await updateStage({
      stageId: 44,
      title: "c'est cool",
      message: "ça va aller t'inquiète pas",
      threshold: 86,
      prescriberTitle: 'palier bof',
      prescriberDescription: 'tu es moyen',
      stageRepository,
    });

    //then
    expect(stageRepository.updateStage).to.have.been.calledOnceWithExactly({
      id: 44,
      title: "c'est cool",
      message: "ça va aller t'inquiète pas",
      threshold: 86,
      prescriberTitle: 'palier bof',
      prescriberDescription: 'tu es moyen',
    });
  });
});
