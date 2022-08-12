// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, sinon } = require('../../../../test-helper');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const dataSource = require('../../../../../lib/infrastructure/datasources/learning-content/datasource');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'lcms'.
const lcms = require('../../../../../lib/infrastructure/lcms');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'LearningCo... Remove this comment to see the full error message
const LearningContentResourceNotFound = require('../../../../../lib/infrastructure/datasources/learning-content/LearningContentResourceNotFound');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'cache'.
const cache = require('../../../../../lib/infrastructure/caches/learning-content-cache');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Infrastructure | Datasource | Learning Content | datasource', function () {
  let someDatasource: $TSFixMe;

  // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
  beforeEach(function () {
    sinon.stub(cache, 'get');
    someDatasource = dataSource.extend({
      modelName: 'learningContentModel',
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#get', function () {
    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(function () {
      cache.get.callsFake((generator: $TSFixMe) => generator());
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('(success cases)', function () {
      let learningContent;

      // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
      beforeEach(function () {
        learningContent = {
          learningContentModel: [
            { id: 'rec1', property: 'value1' },
            { id: 'rec2', property: 'value2' },
          ],
        };
        sinon.stub(lcms, 'getLatestRelease').resolves(learningContent);
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should fetch a single record from LCMS API (or its cached copy)', async function () {
        // when
        const record = await someDatasource.get('rec1');

        // then
        expect(record).to.deep.equal({ id: 'rec1', property: 'value1' });
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should correctly manage the `this` context', async function () {
        // given
        const unboundGet = someDatasource.get;

        // when
        const record = await unboundGet('rec1');

        // then
        expect(record).to.deep.equal({ id: 'rec1', property: 'value1' });
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should be cachable', async function () {
        // when
        await someDatasource.get('rec1');

        // then
        expect(cache.get).to.have.been.called;
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('(error cases)', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should throw an LearningContentResourceNotFound if record was not found', function () {
        // given
        const learningContent = {
          learningContentModel: [
            { id: 'rec1', property: 'value1' },
            { id: 'rec2', property: 'value2' },
          ],
        };
        sinon.stub(lcms, 'getLatestRelease').resolves(learningContent);

        // when
        const promise = someDatasource.get('UNKNOWN_RECORD_ID');

        // then
        return expect(promise).to.have.been.rejectedWith(LearningContentResourceNotFound);
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should dispatch error in case of generic error', function () {
        // given
        const err = new Error();
        sinon.stub(lcms, 'getLatestRelease').rejects(err);

        // when
        const promise = someDatasource.get('rec1');

        // then
        return expect(promise).to.have.been.rejectedWith(err);
      });
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#getMany', function () {
    let learningContent;

    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(function () {
      cache.get.callsFake((generator: $TSFixMe) => generator());

      learningContent = {
        learningContentModel: [
          { id: 'rec1', property: 'value1' },
          { id: 'rec2', property: 'value2' },
          { id: 'rec3', property: 'value3' },
        ],
      };
      sinon.stub(lcms, 'getLatestRelease').resolves(learningContent);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should fetch all records from LCMS API corresponfing to the ids passed', async function () {
      // when
      const result = await someDatasource.getMany(['rec1', 'rec2']);

      // then
      expect(result).to.deep.equal([
        { id: 'rec1', property: 'value1' },
        { id: 'rec2', property: 'value2' },
      ]);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should throw an LearningContentResourceNotFound if no record was found', function () {
      // when
      const promise = someDatasource.getMany(['UNKNOWN_RECORD_ID']);

      // then
      return expect(promise).to.have.been.rejectedWith(LearningContentResourceNotFound);
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#list', function () {
    let learningContent: $TSFixMe;

    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(function () {
      cache.get.callsFake((generator: $TSFixMe) => generator());

      learningContent = {
        learningContentModel: [
          { id: 'rec1', property: 'value1' },
          { id: 'rec2', property: 'value2' },
        ],
      };
      sinon.stub(lcms, 'getLatestRelease').resolves(learningContent);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should fetch all the records of a given type from LCMS API (or its cached copy)', async function () {
      // when
      const learningContentModelObjects = await someDatasource.list();

      // then
      expect(learningContentModelObjects).to.deep.equal(learningContent.learningContentModel);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should correctly manage the `this` context', async function () {
      // given
      const unboundList = someDatasource.list;

      // when
      const learningContentModelObjects = await unboundList();

      // then
      expect(learningContentModelObjects).to.deep.equal(learningContent.learningContentModel);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should be cachable', async function () {
      // when
      await someDatasource.list();

      // then
      expect(cache.get).to.have.been.called;
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#refreshLearningContentCacheRecords', function () {
    let learningContent: $TSFixMe;

    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(function () {
      cache.get.withArgs(someDatasource.modelName).callsFake((generator: $TSFixMe) => generator());
      sinon.stub(cache, 'set');
      learningContent = {
        learningContentModel: [
          { id: 'rec1', property: 'value1' },
          { id: 'rec2', property: 'value2' },
        ],
      };
      sinon.stub(lcms, 'getLatestRelease').resolves(learningContent);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should load all the learning content table content in the cache (and return them)', async function () {
      // when
      const results = await dataSource.refreshLearningContentCacheRecords();

      // then
      expect(results).to.equal(learningContent);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should preload cache', async function () {
      // when
      await dataSource.refreshLearningContentCacheRecords();

      // then
      expect(cache.set).to.have.been.calledWith(learningContent);
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#refreshLearningContentCacheRecord', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
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
      sinon.stub(cache, 'set').callsFake((value: $TSFixMe) => value);

      // when
      const entry = await someDatasource.refreshLearningContentCacheRecord('rec1', record);

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
