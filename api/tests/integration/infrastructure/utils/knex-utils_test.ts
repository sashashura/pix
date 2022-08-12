// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, databaseBuilder } = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'fetchPage'... Remove this comment to see the full error message
const { fetchPage, DEFAULT_PAGINATION } = require('../../../../lib/infrastructure/utils/knex-utils');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'knex'.
const { knex } = require('../../../../lib/infrastructure/bookshelf');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Integration | Infrastructure | Utils | Knex utils', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('fetchPage', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should fetch the given page and return results and pagination data', async function () {
      // given
      const letterA = 'a'.charCodeAt(0);
      _.times(5, (index: $TSFixMe) => databaseBuilder.factory.buildCampaign({ name: `${String.fromCharCode(letterA + index)}` }));
      await databaseBuilder.commit();

      // when
      const query = knex.select('name').from('campaigns').orderBy('name', 'ASC');
      const { results, pagination } = await fetchPage(query, { number: 2, size: 2 });

      // then
      expect(results).to.have.lengthOf(2);
      expect(results.map((result: $TSFixMe) => result.name)).exactlyContainInOrder(['c', 'd']);
      expect(pagination).to.deep.equal({
        page: 2,
        pageSize: 2,
        rowCount: 5,
        pageCount: 3,
      });
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should correctly count rowCount with a distinct in the select clause', async function () {
      // given
      databaseBuilder.factory.buildCampaign({ name: 'DoublonA' });
      databaseBuilder.factory.buildCampaign({ name: 'DoublonA' });
      databaseBuilder.factory.buildCampaign({ name: 'DoublonB' });
      databaseBuilder.factory.buildCampaign({ name: 'DoublonB' });
      await databaseBuilder.commit();

      // when
      const query = knex.distinct('name').from('campaigns');
      const { results, pagination } = await fetchPage(query);

      // then
      expect(results).to.have.lengthOf(2);
      expect(results.map((result: $TSFixMe) => result.name)).exactlyContain(['DoublonA', 'DoublonB']);
      expect(pagination.rowCount).to.equal(2);
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('#pagination.page', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return the requested page when there are results', async function () {
        // given
        const pageNumber = 2;
        const pageSize = 1;
        const total = 3;
        _.times(total, (index: $TSFixMe) => databaseBuilder.factory.buildCampaign({ name: `c-${index}` }));
        await databaseBuilder.commit();

        // when
        const query = knex.select('name').from('campaigns');
        const { results, pagination } = await fetchPage(query, { number: pageNumber, size: pageSize });

        // then
        expect(results).to.not.be.empty;
        expect(pagination.page).to.equal(pageNumber);
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return the requested page even when there are no results', async function () {
        // given
        const pageNumber = 10000;
        const pageSize = 1;
        const total = 3;
        _.times(total, (index: $TSFixMe) => databaseBuilder.factory.buildCampaign({ name: `c-${index}` }));
        await databaseBuilder.commit();

        // when
        const query = knex.select('name').from('campaigns');
        const { results, pagination } = await fetchPage(query, { number: pageNumber, size: pageSize });

        // then
        expect(results).to.be.empty;
        expect(pagination.page).to.equal(pageNumber);
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return the page 1 when requesting for page 1 or lower', async function () {
        // given
        const pageNumber = 0;
        const pageSize = 1;
        const total = 3;
        _.times(total, (index: $TSFixMe) => databaseBuilder.factory.buildCampaign({ name: `c-${index}` }));
        await databaseBuilder.commit();

        // when
        const query = knex.select('name').from('campaigns');
        const { results, pagination } = await fetchPage(query, { number: pageNumber, size: pageSize });

        // then
        expect(results).to.not.be.empty;
        expect(pagination.page).to.equal(1);
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return the DEFAULT_PAGINATION.PAGE when not indicating the page', async function () {
        // given
        const pageSize = 1;
        const total = 1;
        _.times(total, (index: $TSFixMe) => databaseBuilder.factory.buildCampaign({ name: `c-${index}` }));
        await databaseBuilder.commit();

        // when
        const query = knex.select('name').from('campaigns');
        const { results, pagination } = await fetchPage(query, { size: pageSize });

        // then
        expect(results).to.not.be.empty;
        expect(pagination.page).to.equal(DEFAULT_PAGINATION.PAGE);
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('#pagination.pageSize', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return the requested pageSize when there are results', async function () {
        // given
        const pageNumber = 1;
        const pageSize = 2;
        const total = 3;
        _.times(total, (index: $TSFixMe) => databaseBuilder.factory.buildCampaign({ name: `c-${index}` }));
        await databaseBuilder.commit();

        // when
        const query = knex.select('name').from('campaigns');
        const { results, pagination } = await fetchPage(query, { number: pageNumber, size: pageSize });

        // then
        expect(results).to.have.length(pageSize);
        expect(pagination.pageSize).to.equal(pageSize);
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return the requested page size even when there less results than expected', async function () {
        // given
        const pageNumber = 1;
        const total = 3;
        const pageSize = 6;
        _.times(total, (index: $TSFixMe) => databaseBuilder.factory.buildCampaign({ name: `c-${index}` }));
        await databaseBuilder.commit();

        // when
        const query = knex.select('name').from('campaigns');
        const { results, pagination } = await fetchPage(query, { number: pageNumber, size: pageSize });

        // then
        expect(results).to.have.length(total);
        expect(pagination.pageSize).to.equal(pageSize);
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return the requested page size even when there are no results', async function () {
        // given
        const pageNumber = 1000;
        const pageSize = 5;
        const total = 1;
        _.times(total, (index: $TSFixMe) => databaseBuilder.factory.buildCampaign({ name: `c-${index}` }));
        await databaseBuilder.commit();

        // when
        const query = knex.select('name').from('campaigns');
        const { results, pagination } = await fetchPage(query, { number: pageNumber, size: pageSize });

        // then
        expect(results).to.be.empty;
        expect(pagination.pageSize).to.equal(pageSize);
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return the DEFAULT_PAGINATION.PAGE_SIZE when not indicating the size', async function () {
        // given
        const pageNumber = 1;
        const total = DEFAULT_PAGINATION.PAGE_SIZE + 1;
        _.times(total, (index: $TSFixMe) => databaseBuilder.factory.buildCampaign({ name: `c-${index}` }));
        await databaseBuilder.commit();

        // when
        const query = knex.select('name').from('campaigns');
        const { results, pagination } = await fetchPage(query, { number: pageNumber });

        // then
        expect(results).to.have.length(pagination.pageSize);
        expect(pagination.pageSize).to.equal(DEFAULT_PAGINATION.PAGE_SIZE);
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('#pagination.rowCount', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return the rowCount for the whole query when pagination has results', async function () {
        // given
        const pageNumber = 1;
        const pageSize = 3;
        const total = 5;
        _.times(total, (index: $TSFixMe) => databaseBuilder.factory.buildCampaign({ name: `c-${index}` }));
        await databaseBuilder.commit();

        // when
        const query = knex.select('name').from('campaigns');
        const { results, pagination } = await fetchPage(query, { number: pageNumber, size: pageSize });

        // then
        expect(results).to.not.be.empty;
        expect(pagination.rowCount).to.equal(total);
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return the rowCount for the whole query even if there are no results with requested pagination', async function () {
        // given
        const pageNumber = 100000;
        const pageSize = 2;
        const total = 3;
        _.times(total, (index: $TSFixMe) => databaseBuilder.factory.buildCampaign({ name: `c-${index}` }));
        await databaseBuilder.commit();

        // when
        const query = knex.select('name').from('campaigns');
        const { results, pagination } = await fetchPage(query, { number: pageNumber, size: pageSize });

        // then
        expect(results).to.be.empty;
        expect(pagination.rowCount).to.equal(total);
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('#pagination.pageCount', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return the pageCount according to the total row count for the whole query according to the requested page size', async function () {
        // given
        const pageNumber = 1;
        const pageSize = 2;
        const total = 10;
        _.times(total, (index: $TSFixMe) => databaseBuilder.factory.buildCampaign({ name: `c-${index}` }));
        await databaseBuilder.commit();

        // when
        const query = knex.select('name').from('campaigns');
        const { results, pagination } = await fetchPage(query, { number: pageNumber, size: pageSize });

        // then
        expect(results).to.not.be.empty;
        expect(pagination.pageCount).to.equal(5);
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return the pageCount even when the last page would be partially filled', async function () {
        // given
        const pageNumber = 1;
        const pageSize = 2;
        const total = 3;
        _.times(total, (index: $TSFixMe) => databaseBuilder.factory.buildCampaign({ name: `c-${index}` }));
        await databaseBuilder.commit();

        // when
        const query = knex.select('name').from('campaigns');
        const { results, pagination } = await fetchPage(query, { number: pageNumber, size: pageSize });

        // then
        expect(results).to.not.be.empty;
        expect(pagination.pageCount).to.equal(2);
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return the pageCount even if there are no results with requested pagination', async function () {
        // given
        const pageNumber = 100000;
        const pageSize = 2;
        const total = 3;
        _.times(total, (index: $TSFixMe) => databaseBuilder.factory.buildCampaign({ name: `c-${index}` }));
        await databaseBuilder.commit();

        // when
        const query = knex.select('name').from('campaigns');
        const { results, pagination } = await fetchPage(query, { number: pageNumber, size: pageSize });

        // then
        expect(results).to.be.empty;
        expect(pagination.pageCount).to.equal(2);
      });
    });
  });
});
