// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'knex'.
const { knex, expect, databaseBuilder, catchErr } = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'KnowledgeE... Remove this comment to see the full error message
const KnowledgeElement = require('../../../../lib/domain/models/KnowledgeElement');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'knowledgeE... Remove this comment to see the full error message
const knowledgeElementSnapshotRepository = require('../../../../lib/infrastructure/repositories/knowledge-element-snapshot-repository');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'AlreadyExi... Remove this comment to see the full error message
const { AlreadyExistingEntityError } = require('../../../../lib/domain/errors');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'DomainTran... Remove this comment to see the full error message
const DomainTransaction = require('../../../../lib/infrastructure/DomainTransaction');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Integration | Repository | KnowledgeElementSnapshotRepository', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#save', function () {
    // @ts-expect-error TS(2304): Cannot find name 'afterEach'.
    afterEach(function () {
      return knex('knowledge-element-snapshots').delete();
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should save knowledge elements snapshot for a userId and a date', async function () {
      // given
      const snappedAt = new Date('2019-04-01');
      const userId = databaseBuilder.factory.buildUser().id;
      const knowledgeElement1 = databaseBuilder.factory.buildKnowledgeElement({
        userId,
        createdAt: new Date('2019-03-01'),
      });
      const knowledgeElement2 = databaseBuilder.factory.buildKnowledgeElement({
        userId,
        createdAt: new Date('2019-03-01'),
      });
      const knowledgeElements = [knowledgeElement1, knowledgeElement2];
      await databaseBuilder.commit();

      // when
      await knowledgeElementSnapshotRepository.save({ userId, snappedAt, knowledgeElements });

      // then
      const actualUserSnapshot = await knex.select('*').from('knowledge-element-snapshots').first();
      expect(actualUserSnapshot.userId).to.deep.equal(userId);
      expect(actualUserSnapshot.snappedAt).to.deep.equal(snappedAt);
      const actualKnowledgeElements = [];
      for (const knowledgeElementData of actualUserSnapshot.snapshot) {
        actualKnowledgeElements.push(
          new KnowledgeElement({
            ...knowledgeElementData,
            createdAt: new Date(knowledgeElementData.createdAt),
          })
        );
      }
      expect(actualKnowledgeElements).to.deep.equal(knowledgeElements);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should throw an error if knowledge elements snapshot already exist for userId and a date', async function () {
      // given
      const snappedAt = new Date('2019-04-01');
      const userId = databaseBuilder.factory.buildUser().id;
      databaseBuilder.factory.buildKnowledgeElementSnapshot({ userId, snappedAt });
      await databaseBuilder.commit();

      // when
      // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
      const error = await catchErr(knowledgeElementSnapshotRepository.save)({
        userId,
        snappedAt,
        knowledgeElements: [],
      });

      // then
      expect(error).to.be.instanceOf(AlreadyExistingEntityError);
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when a transaction is given transaction', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('saves knowledge elements snapshot using a transaction', async function () {
        const snappedAt = new Date('2019-04-01');
        const userId = databaseBuilder.factory.buildUser().id;
        const knowledgeElement1 = databaseBuilder.factory.buildKnowledgeElement({
          userId,
          createdAt: new Date('2019-03-01'),
        });
        const knowledgeElements = [knowledgeElement1];
        await databaseBuilder.commit();

        await DomainTransaction.execute((domainTransaction: $TSFixMe) => {
          return knowledgeElementSnapshotRepository.save({ userId, snappedAt, knowledgeElements, domainTransaction });
        });

        const actualUserSnapshot = await knex.select('*').from('knowledge-element-snapshots').first();
        expect(actualUserSnapshot.userId).to.deep.equal(userId);
        expect(actualUserSnapshot.snappedAt).to.deep.equal(snappedAt);
        const actualKnowledgeElements = [];
        for (const knowledgeElementData of actualUserSnapshot.snapshot) {
          actualKnowledgeElements.push(
            new KnowledgeElement({
              ...knowledgeElementData,
              createdAt: new Date(knowledgeElementData.createdAt),
            })
          );
        }
        expect(actualKnowledgeElements).to.deep.equal(knowledgeElements);
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('does not save knowledge elements snapshot using a transaction', async function () {
        const snappedAt = new Date('2019-04-01');
        const userId = databaseBuilder.factory.buildUser().id;
        const knowledgeElement1 = databaseBuilder.factory.buildKnowledgeElement({
          userId,
          createdAt: new Date('2019-03-01'),
        });
        const knowledgeElements = [knowledgeElement1];
        await databaseBuilder.commit();

        try {
          await DomainTransaction.execute(async (domainTransaction: $TSFixMe) => {
            await knowledgeElementSnapshotRepository.save({ userId, snappedAt, knowledgeElements, domainTransaction });
            throw new Error();
          });
          // eslint-disable-next-line no-empty
        } catch (error) {}

        const snapshots = await knex.select('*').from('knowledge-element-snapshots');
        expect(snapshots).to.be.empty;
      });
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#findByUserIdsAndSnappedAtDates', function () {
    let userId1: $TSFixMe;
    let userId2: $TSFixMe;

    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(function () {
      userId1 = databaseBuilder.factory.buildUser().id;
      userId2 = databaseBuilder.factory.buildUser().id;
      return databaseBuilder.commit();
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should find knowledge elements snapshoted grouped by userId for userIds and their respective dates', async function () {
      // given
      const snappedAt1 = new Date('2020-01-02');
      const knowledgeElement1 = databaseBuilder.factory.buildKnowledgeElement({ userId: userId1 });
      databaseBuilder.factory.buildKnowledgeElementSnapshot({
        userId: userId1,
        snappedAt: snappedAt1,
        snapshot: JSON.stringify([knowledgeElement1]),
      });
      const snappedAt2 = new Date('2020-02-02');
      const knowledgeElement2 = databaseBuilder.factory.buildKnowledgeElement({ userId: userId2 });
      databaseBuilder.factory.buildKnowledgeElementSnapshot({
        userId: userId2,
        snappedAt: snappedAt2,
        snapshot: JSON.stringify([knowledgeElement2]),
      });
      await databaseBuilder.commit();

      // when
      const knowledgeElementsByUserId = await knowledgeElementSnapshotRepository.findByUserIdsAndSnappedAtDates({
        [userId1]: snappedAt1,
        [userId2]: snappedAt2,
      });

      // then
      expect(knowledgeElementsByUserId[userId1]).to.deep.equal([knowledgeElement1]);
      expect(knowledgeElementsByUserId[userId2]).to.deep.equal([knowledgeElement2]);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return null associated to userId when user does not have a snapshot', async function () {
      // when
      const knowledgeElementsByUserId = await knowledgeElementSnapshotRepository.findByUserIdsAndSnappedAtDates({
        [userId1]: new Date('2020-04-01T00:00:00Z'),
      });

      expect(knowledgeElementsByUserId[userId1]).to.be.null;
    });
  });
});
