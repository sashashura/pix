// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'databaseBu... Remove this comment to see the full error message
const databaseBuffer = require('../database-buffer');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'buildTarge... Remove this comment to see the full error message
const buildTargetProfile = require('./build-target-profile');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');

function buildBadge({
  id = databaseBuffer.getNextId(),
  altMessage = 'alt message',
  imageUrl = '/img_funny.svg',
  message = 'message',
  title = 'title',
  key = 'key',
  isCertifiable = false,
  targetProfileId,
  isAlwaysVisible = false
}: $TSFixMe = {}) {
  targetProfileId = !_.isUndefined(targetProfileId) ? targetProfileId : buildTargetProfile().id;

  const values = {
    id,
    altMessage,
    imageUrl,
    message,
    title,
    key,
    isCertifiable,
    targetProfileId,
    isAlwaysVisible,
  };
  return databaseBuffer.pushInsertable({
    tableName: 'badges',
    values,
  });
}

// @ts-expect-error TS(2454): Variable 'buildBadge' is used before being assigne... Remove this comment to see the full error message
buildBadge.certifiable = function ({
  id = databaseBuffer.getNextId(),
  altMessage = 'alt message',
  imageUrl = '/img_funny.svg',
  message = 'message',
  title = 'title',
  key = 'key',
  targetProfileId,
  isAlwaysVisible = false
}: $TSFixMe) {
  return buildBadge({
    id,
    altMessage,
    imageUrl,
    message,
    title,
    key,
    isCertifiable: true,
    targetProfileId,
    isAlwaysVisible,
  });
};

// @ts-expect-error TS(2454): Variable 'buildBadge' is used before being assigne... Remove this comment to see the full error message
buildBadge.notCertifiable = function ({
  id = databaseBuffer.getNextId(),
  altMessage = 'alt message',
  imageUrl = '/img_funny.svg',
  message = 'message',
  title = 'title',
  key = 'key',
  targetProfileId,
  isAlwaysVisible = false
}: $TSFixMe) {
  return buildBadge({
    id,
    altMessage,
    imageUrl,
    message,
    title,
    key,
    isCertifiable: false,
    targetProfileId,
    isAlwaysVisible,
  });
};

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = buildBadge;
