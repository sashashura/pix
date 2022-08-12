// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, databaseBuilder } = require('../../test-helper');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'knexDataba... Remove this comment to see the full error message
const knexDatabaseConnection = require('../../../db/knex-database-connection');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'knex'.
const knex = knexDatabaseConnection.knex;

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'UserNotFou... Remove this comment to see the full error message
const { UserNotFoundError } = require('../../../lib/domain/errors');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'userReposi... Remove this comment to see the full error message
const userRepository = require('../../../lib/infrastructure/repositories/user-repository');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Integration | Infrastructure | knex-database-connection', function () {
  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('should connect to the database', async function () {
    // when
    const resultSet = await knex.raw('SELECT 1 as value');

    // then
    expect(resultSet.rows || resultSet).to.deep.equal([{ value: 1 }]);
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('should empty all tables', async function () {
    // given
    const { id } = databaseBuilder.factory.buildUser();
    await databaseBuilder.commit();

    // when
    await knexDatabaseConnection.emptyAllTables();

    // then
    await expect(userRepository.get(id)).to.be.rejectedWith(UserNotFoundError);
  });

  // @ts-expect-error TS(2304): Cannot find name 'context'.
  context('QueryBuilder extension - whereInArray', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return records that satisfy the where any clause', async function () {
      // given
      databaseBuilder.factory.buildCampaign({ id: 1 });
      databaseBuilder.factory.buildCampaign({ id: 2 });
      databaseBuilder.factory.buildCampaign({ id: 3 });
      await databaseBuilder.commit();

      // when
      const results = await knex.select('id').from('campaigns').whereInArray('id', [3, 2, 5]).orderBy('id');

      // then
      expect(results).to.deep.equal([{ id: 2 }, { id: 3 }]);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return an empty array when no records satisfy the where any clause', async function () {
      // given
      databaseBuilder.factory.buildCampaign({ id: 1 });
      databaseBuilder.factory.buildCampaign({ id: 2 });
      databaseBuilder.factory.buildCampaign({ id: 3 });
      await databaseBuilder.commit();

      // when
      const results = await knex.select('id').from('campaigns').whereInArray('id', [4, 5]).orderBy('id');

      // then
      expect(results).to.be.empty;
    });
  });
});
