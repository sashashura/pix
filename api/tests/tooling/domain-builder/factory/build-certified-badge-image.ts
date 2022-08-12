// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'CertifiedB... Remove this comment to see the full error message
const CertifiedBadgeImage = require('../../../../lib/domain/read-models/CertifiedBadgeImage');

const buildCertifiedBadgeImage = function buildCertifiedBadgeImage({
  path = 'path',
  isTemporaryBadge = false,
  levelName,
  message = null
}: $TSFixMe = {}) {
  return new CertifiedBadgeImage({
    path,
    isTemporaryBadge,
    levelName,
    message,
  });
};

buildCertifiedBadgeImage.temporary = function ({
  path,
  levelName,
  message
}: $TSFixMe) {
  return buildCertifiedBadgeImage({ path, levelName, isTemporaryBadge: true, message });
};

buildCertifiedBadgeImage.notTemporary = function ({
  path
}: $TSFixMe) {
  return buildCertifiedBadgeImage({ path, isTemporaryBadge: false });
};

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = buildCertifiedBadgeImage;
