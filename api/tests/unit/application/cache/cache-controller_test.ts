// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, sinon, hFake } = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'cacheContr... Remove this comment to see the full error message
const cacheController = require('../../../../lib/application/cache/cache-controller');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const learningContentDatasources = require('../../../../lib/infrastructure/datasources/learning-content');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'learningCo... Remove this comment to see the full error message
const learningContentDatasource = require('../../../../lib/infrastructure/datasources/learning-content/datasource');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'logger'.
const logger = require('../../../../lib/infrastructure/logger');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Controller | cache-controller', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#refreshCacheEntry', function () {
    const request = {
      params: {
        model: 'challenges',
        id: 'recId',
      },
      payload: {
        property: 'updatedValue',
      },
    };

    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(function () {
      sinon.stub(learningContentDatasources.ChallengeDatasource, 'refreshLearningContentCacheRecord');
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should reply with null when the cache key exists', async function () {
      // given
      learningContentDatasources.ChallengeDatasource.refreshLearningContentCacheRecord.resolves();

      // when
      const response = await cacheController.refreshCacheEntry(request, hFake);

      // then
      expect(
        learningContentDatasources.ChallengeDatasource.refreshLearningContentCacheRecord
      ).to.have.been.calledWithExactly('recId', { property: 'updatedValue' });
      expect(response).to.be.null;
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should reply with null when the cache key does not exist', async function () {
      // given
      learningContentDatasources.ChallengeDatasource.refreshLearningContentCacheRecord.resolves();

      // when
      const response = await cacheController.refreshCacheEntry(request, hFake);

      // Then
      expect(
        learningContentDatasources.ChallengeDatasource.refreshLearningContentCacheRecord
      ).to.have.been.calledWithExactly('recId', { property: 'updatedValue' });
      expect(response).to.be.null;
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#refreshCacheEntries', function () {
    const request = {};

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('nominal case', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should reply with http status 202', async function () {
        // given
        const numberOfDeletedKeys = 0;
        sinon.stub(learningContentDatasource, 'refreshLearningContentCacheRecords').resolves(numberOfDeletedKeys);

        // when
        const response = await cacheController.refreshCacheEntries(request, hFake);

        // then
        expect(learningContentDatasource.refreshLearningContentCacheRecords).to.have.been.calledOnce;
        expect(response.statusCode).to.equal(202);
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('error case', function () {
      let response: $TSFixMe;

      // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
      beforeEach(async function () {
        // given
        sinon.stub(logger, 'error');
        sinon.stub(learningContentDatasource, 'refreshLearningContentCacheRecords').rejects();

        // when
        response = await cacheController.refreshCacheEntries(request, hFake);
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should reply with http status 202', async function () {
        // then
        expect(response.statusCode).to.equal(202);
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should call log errors', async function () {
        // then
        expect(logger.error).to.have.been.calledOnce;
      });
    });
  });
});
