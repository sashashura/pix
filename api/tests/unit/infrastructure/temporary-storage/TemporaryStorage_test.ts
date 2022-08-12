// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect } = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'TemporaryS... Remove this comment to see the full error message
const TemporaryStorage = require('../../../../lib/infrastructure/temporary-storage/TemporaryStorage');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Infrastructure | temporary-storage | TemporaryStorage', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#save', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should reject an error (because this class actually mocks an interface)', function () {
      // given
      const temporaryStorageInstance = new TemporaryStorage();

      // when
      const result = temporaryStorageInstance.save({ value: {}, expirationDelaySeconds: 1000 });

      // then
      expect(result).to.be.rejected;
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#get', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should reject an error (because this class actually mocks an interface)', function () {
      // given
      const temporaryStorageInstance = new TemporaryStorage();

      // when
      const result = temporaryStorageInstance.get('key');

      // then
      expect(result).to.be.rejected;
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#delete', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should reject an error (because this class actually mocks an interface)', function () {
      // given
      const temporaryStorageInstance = new TemporaryStorage();

      // when
      const result = temporaryStorageInstance.delete('key');

      // then
      expect(result).to.be.rejected;
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#deleteByPrefix', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should reject an error (because this class actually mocks an interface)', function () {
      // given
      const temporaryStorageInstance = new TemporaryStorage();

      // when
      const result = temporaryStorageInstance.deleteByPrefix('123:');

      // then
      expect(result).to.be.rejected;
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#generateKey', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return a key from static method', function () {
      // when
      const result = TemporaryStorage.generateKey();

      // then
      expect(result).to.be.ok;
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#withPrefix', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return a wrapper that adds a prefix to all methods', async function () {
      // given
      const store = {};
      class TestStorage extends TemporaryStorage {
        async save({
          key,
          value
        }: $TSFixMe) {
          // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
          store[key] = value;
        }
        async get(key: $TSFixMe) {
          // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
          return store[key];
        }
        async delete(key: $TSFixMe) {
          // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
          delete store[key];
        }
        async deleteByPrefix(prefix: $TSFixMe) {
          for (const key in store) {
            if (key.startsWith(prefix)) {
              // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
              delete store[key];
            }
          }
        }
      }
      const storage = (new TestStorage() as $TSFixMe).withPrefix('a-prefix:');

      // when & then
      expect(await storage.save({ key: 'a-key', value: 'a-value' })).to.equal('a-key');
      expect(store).to.deep.equal({ 'a-prefix:a-key': 'a-value' });

      expect(await storage.get('a-key')).to.equal('a-value');
      await storage.delete('a-key');
      expect(await storage.get('a-key')).to.be.undefined;

      const randomKey = await storage.save({ value: 'random-key-value' });
      expect(randomKey).to.exist;
      // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
      expect(store['a-prefix:' + randomKey]).to.exist;
      expect(await storage.get(randomKey)).to.equal('random-key-value');

      await storage.save({ key: '123:a-key', value: 'a-value' });
      await storage.deleteByPrefix('123:');
      expect(await storage.get('123:a-key')).to.be.undefined;
    });
  });
});
