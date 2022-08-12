// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Tag'.
const Tag = require('../models/Tag');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = async function createTag({
  tagName,
  tagRepository
}: $TSFixMe) {
  const tag = new Tag({ name: tagName });
  return tagRepository.create(tag);
};
