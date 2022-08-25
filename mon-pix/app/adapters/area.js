import ApplicationAdapter from './application';

export default class Area extends ApplicationAdapter {
  urlForFindAll(modelName) {
    return `${this.host}/${this.namespace}/frameworks/rec123/areas`;
  }
}
