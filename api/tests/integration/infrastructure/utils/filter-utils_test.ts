// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, databaseBuilder, knex } = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'filterByFu... Remove this comment to see the full error message
const { filterByFullName } = require('../../../../lib/infrastructure/utils/filter-utils');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Integration | Utils | filter-utils', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#filterByFullName', function () {
    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when some rows match by full name', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return the matching rows', async function () {
        // given
        databaseBuilder.factory.buildUser({ firstName: 'Bernard', lastName: 'Dupuy' });
        const { id } = databaseBuilder.factory.buildUser({ firstName: 'Robert', lastName: 'Howard' });
        await databaseBuilder.commit();

        // when
        const ids = await knex('users').modify(filterByFullName, 'Robert H', 'firstName', 'lastName').pluck('id');

        // then
        expect(ids).to.deep.equal([id]);
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should handle space before search', async function () {
        // given
        const { id } = databaseBuilder.factory.buildUser({ firstName: 'Bernard', lastName: 'Dupuy' });
        databaseBuilder.factory.buildUser({ firstName: 'Robert', lastName: 'Howard' });
        await databaseBuilder.commit();

        // when
        const ids = await knex('users').modify(filterByFullName, '  dup', 'firstName', 'lastName').pluck('id');

        // then
        expect(ids).to.deep.equal([id]);
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should handle space after search', async function () {
        // given
        const { id } = databaseBuilder.factory.buildUser({ firstName: 'Robert', lastName: 'Howard' });
        databaseBuilder.factory.buildUser({ firstName: 'Bernard', lastName: 'Dupuy' });
        await databaseBuilder.commit();

        // when
        const ids = await knex('users').modify(filterByFullName, 'ert ', 'firstName', 'lastName').pluck('id');

        // then
        expect(ids).to.deep.equal([id]);
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when some some rows match by first name', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return the matching rows', async function () {
        // given
        const { id: id1 } = databaseBuilder.factory.buildUser({ firstName: 'Robert' });
        const { id: id2 } = databaseBuilder.factory.buildUser({ firstName: 'Bernard' });
        const { id: id3 } = databaseBuilder.factory.buildUser({ firstName: 'Barnarbe' });
        databaseBuilder.factory.buildUser({ firstName: 'Luc' });

        await databaseBuilder.commit();

        const ids = await knex('users').modify(filterByFullName, 'be ', 'firstName', 'lastName').pluck('id');

        // then
        expect(ids).to.exactlyContain([id1, id2, id3]);
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when some some rows match by last name', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return the matching rows', async function () {
        // given
        databaseBuilder.factory.buildUser({ lastName: 'Batman' });
        const { id: id1 } = databaseBuilder.factory.buildUser({ lastName: 'Alfred' });
        const { id: id2 } = databaseBuilder.factory.buildUser({ lastName: 'Fredal' });
        const { id: id3 } = databaseBuilder.factory.buildUser({ lastName: 'Fraled' });

        await databaseBuilder.commit();

        const ids = await knex('users').modify(filterByFullName, 'al ', 'firstName', 'lastName').pluck('id');

        // then
        expect(ids).to.exactlyContain([id1, id2, id3]);
      });
    });
  });
});
