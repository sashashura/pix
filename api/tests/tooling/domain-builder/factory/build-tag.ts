// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Tag'.
const Tag = require('../../../../lib/domain/models/Tag');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'buildTag'.
function buildTag({ id = 123, name = 'Type' } = {}) {
  return new Tag({
    id,
    name,
  });
}

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = buildTag;
