const ComplementaryCertificationBadge = require('../../../../lib/domain/models/ComplementaryCertificationBadge');

module.exports = function buildComplementaryCertificationBadge({
  id = 123,
  label = 'Label par défaut',
  level = 1,
  imageUrl = 'url-image.fr',
} = {}) {
  return new ComplementaryCertificationBadge({
    id,
    label,
    level,
    imageUrl,
  });
};
