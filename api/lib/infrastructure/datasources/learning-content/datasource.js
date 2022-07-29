const _ = require('lodash');
const lcms = require('../../lcms');
const LearningContentResourceNotFound = require('./LearningContentResourceNotFound');
const cache = require('../../caches/learning-content-cache');

const _DatasourcePrototype = {
  async get({ id, locale }) {
    const modelObjects = await this.list({ locale });
    const foundObject = _.find(modelObjects, { id });

    if (!foundObject) {
      throw new LearningContentResourceNotFound();
    }

    return foundObject;
  },

  async getMany({ ids, locale }) {
    const modelObjects = await this.list({ locale });

    return ids.map((id) => {
      const foundObject = _.find(modelObjects, { id });

      if (!foundObject) {
        throw new LearningContentResourceNotFound();
      }

      return foundObject;
    });
  },

  async list({ locale }) {
    const learningContent = await this._getLearningContent({ locale });
    return learningContent[this.modelName];
  },

  async _getLearningContent({ locale }) {
    const generator = () => lcms.getLatestRelease(locale);
    const learningContent = await cache.get(generator);
    return learningContent;
  },

  async refreshLearningContentCacheRecord({ id, newEntry, locale }) {
    const currentLearningContent = await this._getLearningContent({ locale });
    const currentRecords = currentLearningContent[this.modelName];
    const updatedRecords = _.reject(currentRecords, { id }).concat([newEntry]);
    const newLearningContent = _.cloneDeep(currentLearningContent);
    newLearningContent[this.modelName] = updatedRecords;
    await cache.set(newLearningContent);
    return newEntry;
  },
};

module.exports = {
  extend(props) {
    const result = Object.assign({}, _DatasourcePrototype, props);
    _.bindAll(result, _.functions(result));
    return result;
  },

  async refreshLearningContentCacheRecords({ locale }) {
    const learningContent = await lcms.getLatestRelease(locale);
    await cache.set(learningContent);
    return learningContent;
  },
};
