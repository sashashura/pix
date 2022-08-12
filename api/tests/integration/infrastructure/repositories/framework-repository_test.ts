// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, mockLearningContent, catchErr } = require('../../../test-helper');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const frameworkRepository = require('../../../../lib/infrastructure/repositories/framework-repository');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Framework'... Remove this comment to see the full error message
const Framework = require('../../../../lib/domain/models/Framework');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'NotFoundEr... Remove this comment to see the full error message
const { NotFoundError } = require('../../../../lib/domain/errors');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Integration | Repository | framework-repository', function () {
  const framework0 = {
    id: 'recId0',
    name: 'mon framework 0',
  };
  const framework1 = {
    id: 'recId0',
    name: 'mon framework 1',
  };

  const learningContent = { frameworks: [framework0, framework1] };

  // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
  beforeEach(function () {
    mockLearningContent(learningContent);
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#list', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return all frameworks', async function () {
      // when
      const frameworks = await frameworkRepository.list();

      // then
      expect(frameworks).to.have.lengthOf(2);
      expect(frameworks[0]).to.be.instanceof(Framework);
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#getByName', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return a framework', async function () {
      // when
      const framework = await frameworkRepository.getByName('mon framework 1');

      // then
      expect(framework).to.be.instanceof(Framework);
      expect(framework).to.deep.equal(framework1);
    });

    // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
    describe('when framework is not found', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return a rejection', async function () {
        //given
        const frameworkName = 'framework123';

        // when
        // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
        const error = await catchErr(frameworkRepository.getByName)(frameworkName);

        // then
        expect(error).to.be.an.instanceof(NotFoundError);
        expect((error as $TSFixMe).message).to.equal('Framework not found for name framework123');
      });
    });
  });
});
