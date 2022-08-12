// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'NodeCache'... Remove this comment to see the full error message
const NodeCache = require('node-cache');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, sinon } = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'InMemoryTe... Remove this comment to see the full error message
const InMemoryTemporaryStorage = require('../../../../lib/infrastructure/temporary-storage/InMemoryTemporaryStorage');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Infrastructure | temporary-storage | InMemoryTemporaryStorage', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#constructor', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should create an InMemoryTemporaryStorage instance', function () {
      // when
      const inMemoryTemporaryStorage = new InMemoryTemporaryStorage();

      // then
      expect(inMemoryTemporaryStorage._client).to.be.an.instanceOf(NodeCache);
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#save', function () {
    let clock: $TSFixMe;

    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(function () {
      clock = sinon.useFakeTimers();
    });

    // @ts-expect-error TS(2304): Cannot find name 'afterEach'.
    afterEach(function () {
      clock.restore();
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should resolve with the generated key', function () {
      // given
      const inMemoryTemporaryStorage = new InMemoryTemporaryStorage();

      // when
      const key = inMemoryTemporaryStorage.save({ value: {}, expirationDelaySeconds: 1000 });

      // then
      expect(key).to.exist;
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return a key from passed key parameter if valid', function () {
      // given
      const keyParameter = 'KEY-PARAMETER';
      const inMemoryTemporaryStorage = new InMemoryTemporaryStorage();

      // when
      const returnedKey = inMemoryTemporaryStorage.save({
        key: keyParameter,
        value: {},
        expirationDelaySeconds: 1000,
      });

      // then
      expect(returnedKey).to.be.equal(keyParameter);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return a generated key if key parameter is not valid', function () {
      // given
      const keyParameter = '  ';
      const inMemoryTemporaryStorage = new InMemoryTemporaryStorage();

      // when
      const returnedKey = inMemoryTemporaryStorage.save({
        key: keyParameter,
        value: {},
        expirationDelaySeconds: 1000,
      });

      // then
      expect(returnedKey).not.be.equal(keyParameter);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should save key value with a defined ttl in seconds', async function () {
      // given
      const TWO_MINUTES_IN_SECONDS = 2 * 60;
      const TWO_MINUTES_IN_MILLISECONDS = 2 * 60 * 1000;

      const inMemoryTemporaryStorage = new InMemoryTemporaryStorage();

      // when
      const key = await inMemoryTemporaryStorage.save({
        value: { name: 'name' },
        expirationDelaySeconds: TWO_MINUTES_IN_SECONDS,
      });

      // then
      const expirationKeyInTimestamp = inMemoryTemporaryStorage._client.getTtl(key);
      expect(expirationKeyInTimestamp).to.equal(TWO_MINUTES_IN_MILLISECONDS);
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#get', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should retrieve the value if it exists', async function () {
      // given
      const value = { name: 'name' };
      const expirationDelaySeconds = 1000;

      const inMemoryTemporaryStorage = new InMemoryTemporaryStorage();
      const key = await inMemoryTemporaryStorage.save({ value, expirationDelaySeconds });

      // when
      const result = await inMemoryTemporaryStorage.get(key);

      // then
      expect(result).to.deep.equal(value);
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#delete', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should delete the value if it exists', async function () {
      // given
      const value = { name: 'name' };
      const expirationDelaySeconds = 1000;

      const inMemoryTemporaryStorage = new InMemoryTemporaryStorage();
      const key = await inMemoryTemporaryStorage.save({ value, expirationDelaySeconds });

      // when
      await inMemoryTemporaryStorage.delete(key);

      // then
      const savedKey = await inMemoryTemporaryStorage.get(key);
      expect(savedKey).to.be.undefined;
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#deleteByPrefix', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should delete all found keys with the given matching prefix', async function () {
      // given
      const expirationDelaySeconds = 1000;

      const inMemoryTemporaryStorage = new InMemoryTemporaryStorage();
      await inMemoryTemporaryStorage.save({ key: '456:c', value: {}, expirationDelaySeconds });
      await inMemoryTemporaryStorage.save({ key: '123:a', value: {}, expirationDelaySeconds });
      await inMemoryTemporaryStorage.save({ key: '123:b', value: {}, expirationDelaySeconds });

      // when
      await inMemoryTemporaryStorage.deleteByPrefix('123:');

      // then
      expect(await inMemoryTemporaryStorage.get('123:a')).to.be.undefined;
      expect(await inMemoryTemporaryStorage.get('123:b')).to.be.undefined;
      expect(await inMemoryTemporaryStorage.get('456:c')).to.exist;
    });
  });
});
