// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, sinon } = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'lcms'.
const lcms = require('../../../../lib/infrastructure/lcms');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'cache'.
const cache = require('../../../../lib/infrastructure/caches/learning-content-cache');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const createLcmsRelease = require('../../../../lib/domain/usecases/create-lcms-release');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | UseCase | create-lcms-release', function () {
  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('call the createRelease on the lcms module', async function () {
    // given
    sinon.stub(lcms, 'createRelease').resolves();

    // when
    await createLcmsRelease();

    // then
    expect(lcms.createRelease).to.have.been.called;
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('should update cache', async function () {
    // given
    const learningContent = Symbol('learning-content');
    sinon.stub(lcms, 'createRelease').resolves(learningContent);
    sinon.stub(cache, 'set').resolves();

    // when
    await createLcmsRelease();

    // then
    expect(cache.set).to.have.been.calledWith(learningContent);
  });
});
