// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'buildKnowl... Remove this comment to see the full error message
const buildKnowledgeElement = require('./build-knowledge-element');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'databaseBu... Remove this comment to see the full error message
const databaseBuffer = require('../database-buffer');

function buildSnapshot({
  id,
  userId,
  snappedAt,
  knowledgeElementsAttributes
}: $TSFixMe) {
  const knowledgeElements = knowledgeElementsAttributes.map((attributes: $TSFixMe) => buildKnowledgeElement(attributes));

  const values = {
    id,
    userId,
    snappedAt,
    snapshot: JSON.stringify(knowledgeElements),
  };

  return databaseBuffer.pushInsertable({
    tableName: 'knowledge-element-snapshots',
    values,
  });
}

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  buildSnapshot,
};
