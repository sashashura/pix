// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'lcms'.
const lcms = require('../../lcms');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'LearningCo... Remove this comment to see the full error message
const LearningContentResourceNotFound = require('./LearningContentResourceNotFound');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'cache'.
const cache = require('../../caches/learning-content-cache');

const _DatasourcePrototype = {
  async get(id: $TSFixMe) {
    const modelObjects = await this.list();
    const foundObject = _.find(modelObjects, { id });

    if (!foundObject) {
      throw new LearningContentResourceNotFound();
    }

    return foundObject;
  },

  async getMany(ids: $TSFixMe) {
    const modelObjects = await this.list();

    return ids.map((id: $TSFixMe) => {
      const foundObject = _.find(modelObjects, { id });

      if (!foundObject) {
        throw new LearningContentResourceNotFound();
      }

      return foundObject;
    });
  },

  async list() {
    const learningContent = await this._getLearningContent();
    return learningContent[(this as $TSFixMe).modelName];
  },

  async _getLearningContent() {
    const generator = () => lcms.getLatestRelease();
    const learningContent = await cache.get(generator);
    return learningContent;
  },

  async refreshLearningContentCacheRecord(id: $TSFixMe, newEntry: $TSFixMe) {
    const currentLearningContent = await this._getLearningContent();
    const currentRecords = currentLearningContent[(this as $TSFixMe).modelName];
    const updatedRecords = _.reject(currentRecords, { id }).concat([newEntry]);
    const newLearningContent = _.cloneDeep(currentLearningContent);
    newLearningContent[(this as $TSFixMe).modelName] = updatedRecords;
    await cache.set(newLearningContent);
    return newEntry;
  },
};

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  extend(props: $TSFixMe) {
    const result = Object.assign({}, _DatasourcePrototype, props);
    _.bindAll(result, _.functions(result));
    return result;
  },

  async refreshLearningContentCacheRecords() {
    const learningContent = await lcms.getLatestRelease();
    await cache.set(learningContent);
    return learningContent;
  },
};
