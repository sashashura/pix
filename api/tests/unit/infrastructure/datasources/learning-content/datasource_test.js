const { expect, sinon } = require('../../../../test-helper');
const dataSource = require('../../../../../lib/infrastructure/datasources/learning-content/datasource');
const lcms = require('../../../../../lib/infrastructure/lcms');
const LearningContentResourceNotFound = require('../../../../../lib/infrastructure/datasources/learning-content/LearningContentResourceNotFound');
const cache = require('../../../../../lib/infrastructure/caches/learning-content-cache');

describe('Unit | Infrastructure | Datasource | Learning Content | datasource', function () {
  let someDatasource;
  const locale = 'fr-fr';

  beforeEach(function () {
    sinon.stub(cache, 'get');
    someDatasource = dataSource.extend({
      modelName: 'learningContentModel',
    });
  });

  describe('#get', function () {
    beforeEach(function () {
      cache.get.callsFake((generator) => generator());
    });

    context('(success cases)', function () {
      let learningContent;

      beforeEach(function () {
        learningContent = {
          learningContentModel: [
            { id: 'rec1', property: 'value1' },
            { id: 'rec2', property: 'value2' },
          ],
        };

        sinon.stub(lcms, 'getLatestRelease').withArgs(locale).resolves(learningContent);
      });

      it('should fetch a single record from LCMS API (or its cached copy)', async function () {
        // when
        const record = await someDatasource.get({ id: 'rec1', locale });

        // then
        expect(record).to.deep.equal({ id: 'rec1', property: 'value1' });
      });

      it('should correctly manage the `this` context', async function () {
        // given
        const unboundGet = someDatasource.get;

        // when
        const record = await unboundGet({ id: 'rec1', locale });

        // then
        expect(record).to.deep.equal({ id: 'rec1', property: 'value1' });
      });

      it('should be cachable', async function () {
        // when
        await someDatasource.get({ id: 'rec1', locale });

        // then
        expect(cache.get).to.have.been.called;
      });
    });

    context('(error cases)', function () {
      it('should throw an LearningContentResourceNotFound if record was not found', function () {
        // given
        const learningContent = {
          learningContentModel: [
            { id: 'rec1', property: 'value1' },
            { id: 'rec2', property: 'value2' },
          ],
        };
        sinon.stub(lcms, 'getLatestRelease').withArgs(locale).resolves(learningContent);

        // when
        const promise = someDatasource.get({ id: 'UNKNOWN_RECORD_ID', locale });

        // then
        return expect(promise).to.have.been.rejectedWith(LearningContentResourceNotFound);
      });

      it('should dispatch error in case of generic error', function () {
        // given
        const err = new Error();
        sinon.stub(lcms, 'getLatestRelease').withArgs(locale).rejects(err);

        // when
        const promise = someDatasource.get({ id: 'rec1', locale });

        // then
        return expect(promise).to.have.been.rejectedWith(err);
      });
    });
  });

  describe('#getMany', function () {
    let learningContent;

    beforeEach(function () {
      cache.get.callsFake((generator) => generator());

      learningContent = {
        learningContentModel: [
          { id: 'rec1', property: 'value1' },
          { id: 'rec2', property: 'value2' },
          { id: 'rec3', property: 'value3' },
        ],
      };
      sinon.stub(lcms, 'getLatestRelease').withArgs(locale).resolves(learningContent);
    });

    it('should fetch all records from LCMS API corresponfing to the ids passed', async function () {
      // when
      const result = await someDatasource.getMany({ ids: ['rec1', 'rec2'], locale });

      // then
      expect(result).to.deep.equal([
        { id: 'rec1', property: 'value1' },
        { id: 'rec2', property: 'value2' },
      ]);
    });

    it('should throw an LearningContentResourceNotFound if no record was found', function () {
      // when
      const promise = someDatasource.getMany({ ids: ['UNKNOWN_RECORD_ID'], locale });

      // then
      return expect(promise).to.have.been.rejectedWith(LearningContentResourceNotFound);
    });
  });

  describe('#list', function () {
    let learningContent;

    beforeEach(function () {
      cache.get.callsFake((generator) => generator());

      learningContent = {
        learningContentModel: [
          { id: 'rec1', property: 'value1' },
          { id: 'rec2', property: 'value2' },
        ],
      };
      sinon.stub(lcms, 'getLatestRelease').withArgs(locale).resolves(learningContent);
    });

    it('should fetch all the records of a given type from LCMS API (or its cached copy)', async function () {
      // when
      const learningContentModelObjects = await someDatasource.list({ locale });

      // then
      expect(learningContentModelObjects).to.deep.equal(learningContent.learningContentModel);
    });

    it('should correctly manage the `this` context', async function () {
      // given
      const unboundList = someDatasource.list;

      // when
      const learningContentModelObjects = await unboundList({ locale });

      // then
      expect(learningContentModelObjects).to.deep.equal(learningContent.learningContentModel);
    });

    it('should be cachable', async function () {
      // when
      await someDatasource.list({ locale });

      // then
      expect(cache.get).to.have.been.called;
    });
  });

  describe('#refreshLearningContentCacheRecords', function () {
    let learningContent;

    beforeEach(function () {
      cache.get.withArgs(someDatasource.modelName).callsFake((generator) => generator());
      sinon.stub(cache, 'set');
      learningContent = {
        learningContentModel: [
          { id: 'rec1', property: 'value1' },
          { id: 'rec2', property: 'value2' },
        ],
      };
      sinon.stub(lcms, 'getLatestRelease').withArgs(locale).resolves(learningContent);
    });

    it('should load all the learning content table content in the cache (and return them)', async function () {
      // when
      const results = await dataSource.refreshLearningContentCacheRecords({ locale });

      // then
      expect(results).to.equal(learningContent);
    });

    it('should preload cache', async function () {
      // when
      await dataSource.refreshLearningContentCacheRecords({ locale });

      // then
      expect(cache.set).to.have.been.calledWith(learningContent);
    });
  });

  describe('#refreshLearningContentCacheRecord', function () {
    it('should replace the record (identified with id) by given record and store or replace it in the cache', async function () {
      // given
      const record = { id: 'rec1', property: 'updatedValue' };
      const learningContent = {
        learningContentModel: [
          { id: 'rec1', property: 'value1' },
          { id: 'rec2', property: 'value2' },
        ],
        learningContentOtherModel: [{ id: 'rec3', property: 'value3' }],
      };
      cache.get.resolves(learningContent);
      sinon.stub(cache, 'set').callsFake((value) => value);

      // when
      const entry = await someDatasource.refreshLearningContentCacheRecord({ id: 'rec1', newEntry: record, locale });

      // then
      expect(entry).to.deep.equal({
        id: 'rec1',
        property: 'updatedValue',
      });
      expect(cache.set).to.have.been.deep.calledWith({
        learningContentModel: [
          { id: 'rec2', property: 'value2' },
          { id: 'rec1', property: 'updatedValue' },
        ],
        learningContentOtherModel: [{ id: 'rec3', property: 'value3' }],
      });
    });
  });
});
