// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, catchErr, databaseBuilder } = require('../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'doSomethin... Remove this comment to see the full error message
const { doSomething } = require('../../../scripts/_template');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('#doSomething', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#if throwError is false', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return an identifier ', async function () {
      // given
      databaseBuilder.factory.buildUser({ id: 1 });
      await databaseBuilder.commit();
      const throwError = false;

      // when
      const data = await doSomething({ throwError });

      // then
      expect(data).to.deep.equal({ id: 1 });
    });
  });
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#if throwError is true', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should throw a error', async function () {
      // given
      const throwError = true;

      // when
      // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
      const error = await catchErr(doSomething)({ throwError });

      // then
      expect(error).to.be.instanceOf(Error);
      expect((error as $TSFixMe).message).to.be.equal('An error occurred');
    });
  });
});
