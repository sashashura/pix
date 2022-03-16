const { Serializer } = require('jsonapi-serializer');

module.exports = {
  serialize(config) {
    return new Serializer('feature-toggles', {
      transform(config) {
        return { id: 0, ...config };
      },
      attributes: Object.keys(config),
    }).serialize(config);
  },
};
