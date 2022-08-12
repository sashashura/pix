// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = function updateStage({
  stageId,
  title,
  message,
  threshold,
  prescriberTitle,
  prescriberDescription,
  stageRepository
}: $TSFixMe) {
  return stageRepository.updateStage({
    id: stageId,
    title,
    message,
    threshold,
    prescriberTitle,
    prescriberDescription,
  });
};
