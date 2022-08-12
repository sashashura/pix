// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect } = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'databaseBu... Remove this comment to see the full error message
const databaseBuffer = require('../../../../db/database-builder/database-buffer');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Tooling | DatabaseBuilder | database-buffer', function () {
  // @ts-expect-error TS(2304): Cannot find name 'afterEach'.
  afterEach(function () {
    databaseBuffer.objectsToInsert = [];
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#getNextId', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return next incremental id', function () {
      // when
      const idA = databaseBuffer.getNextId();
      const idB = databaseBuffer.getNextId();
      const idC = databaseBuffer.getNextId();

      // then
      expect(idB).to.equal(idA + 1);
      expect(idC).to.equal(idB + 1);
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#pushInsertable', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should add an object to insert', function () {
      // given
      const tableName = 'someTableName';
      const values = { id: 123, a: 'aVal', b: 'bVal' };

      // when
      databaseBuffer.pushInsertable({ tableName, values });

      // then
      expect(databaseBuffer.objectsToInsert).to.deep.equal([{ tableName, values }]);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return inserted values', function () {
      // given
      const tableName = 'someTableName';
      const values = { id: 123, a: 'aVal', b: 'bVal' };

      // when
      const expectedValues = databaseBuffer.pushInsertable({ tableName, values });

      // then
      expect(expectedValues).to.deep.equal(values);
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#purge', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should empty objectsToInsert array', function () {
      // given
      databaseBuffer.objectsToInsert = ['someValue'];

      // when
      databaseBuffer.purge();

      // then
      expect(databaseBuffer.objectsToInsert).to.be.empty;
    });
  });
});
