// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, catchErr, sinon } = require('../../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'csvSeriali... Remove this comment to see the full error message
const csvSerializer = require('../../../../../lib/infrastructure/serializers/csv/csv-serializer');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'logger'.
const logger = require('../../../../../lib/infrastructure/logger');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Serializer | CSV | csv-serializer', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#serializeLine', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should quote strings', async function () {
      // given
      const safeNumberAsString = '-123456';
      const csvExpected =
        '"String with \'single quotes\'";' + '"String with ""double quotes""";' + safeNumberAsString + '\n';

      // when
      const csv = csvSerializer.serializeLine([
        "String with 'single quotes'",
        'String with "double quotes"',
        safeNumberAsString,
      ]);

      // then
      expect(csv).to.equal(csvExpected);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should format numbers in French locale', async function () {
      // given
      const csvExpected = '123;' + '123,456\n';

      // when
      const csv = csvSerializer.serializeLine([123, 123.456]);

      // then
      expect(csv).to.equal(csvExpected);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should escape formula-likes to prevent CSV injections', async function () {
      // given
      const csvExpected = '"\'=formula-like";' + '"\'@formula-like";' + '"\'+formula-like";' + '"\'-formula-like"\n';

      // when
      const csv = csvSerializer.serializeLine(['=formula-like', '@formula-like', '+formula-like', '-formula-like']);

      // then
      expect(csv).to.equal(csvExpected);
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('should throw exceptions invalid format', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('given object', async function () {
        // when
        sinon.stub(logger, 'error');
        // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
        await catchErr(csvSerializer.serializeLine)([{}]);
        // then
        expect(logger.error).to.have.been.calledWith(
          'Unknown value type in _csvSerializeValue: object: [object Object]'
        );
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('given null', async function () {
        // when
        sinon.stub(logger, 'error');
        // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
        await catchErr(csvSerializer.serializeLine)([null]);
        // then
        expect(logger.error).to.have.been.calledWith('Unknown value type in _csvSerializeValue: object: null');
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('given undefined', async function () {
        // when
        sinon.stub(logger, 'error');
        // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
        await catchErr(csvSerializer.serializeLine)([undefined]);
        // then
        expect(logger.error).to.have.been.calledWith('Unknown value type in _csvSerializeValue: undefined: undefined');
      });
    });
  });
});
