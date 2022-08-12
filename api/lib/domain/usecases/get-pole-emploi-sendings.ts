// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'poleEmploi... Remove this comment to see the full error message
const poleEmploiService = require('../services/pole-emploi-service');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = async function getPoleEmploiSendings({
  cursor,
  poleEmploiSendingRepository,
  filters
}: $TSFixMe) {
  const cursorData = await poleEmploiService.decodeCursor(cursor);
  const sendings = await poleEmploiSendingRepository.find(cursorData, filters);
  const link = _generateLink(sendings, filters);
  return { sendings, link };
};

function _generateLink(sendings: $TSFixMe, filters: $TSFixMe) {
  if (!sendings.length) return null;

  const lastSending = sendings[sendings.length - 1];
  const link = poleEmploiService.generateLink(lastSending, filters);
  return link;
}
