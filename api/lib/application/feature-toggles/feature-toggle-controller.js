const settings = require('../../config');
const serializer = require('../../infrastructure/serializers/jsonapi/feature-toggle-serializer');

const ALLOWED_APPS = ['monPix', 'orga', 'certif'];

module.exports = {
  getActiveFeatures(request) {
    const app = request.query.app;
    if (app === undefined || !ALLOWED_APPS.includes(app)) {
      return serializer.serialize(settings.featureToggles);
    }

    return serializer.serialize({ ...settings.featureToggles, banner: { ...settings.banners[app] } });
  },
};
