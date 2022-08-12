// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, sinon, catchErr } = require('../../../test-helper');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const createStage = require('../../../../lib/domain/usecases/create-stage');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'stageValid... Remove this comment to see the full error message
const stageValidator = require('../../../../lib/domain/validators/stage-validator');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'EntityVali... Remove this comment to see the full error message
const { EntityValidationError } = require('../../../../lib/domain/errors');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | UseCase | create-stage', function () {
  // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
  beforeEach(function () {
    sinon.stub(stageValidator, 'validate');
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('should throw an EntityValidationError if stage is not valid', async function () {
    // given
    stageValidator.validate.throws(new EntityValidationError({ invalidAttributes: [] }));

    // when
    // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
    const error = await catchErr(createStage)({});

    // then
    expect(error).to.be.instanceOf(EntityValidationError);
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('should call the stage repository', async function () {
    // given
    const stageCreated = {};
    const stageRepository = { create: sinon.stub().returns(stageCreated) };
    const stage = { title: 'My stage' };

    // when
    const result = await createStage({ stage, stageRepository });

    // then
    expect(stageRepository.create.calledWith(stage)).to.be.true;
    expect(result).to.equal(stageCreated);
  });
});
