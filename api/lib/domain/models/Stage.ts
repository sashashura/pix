// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Stage'.
class Stage {
  id: $TSFixMe;
  message: $TSFixMe;
  prescriberDescription: $TSFixMe;
  prescriberTitle: $TSFixMe;
  targetProfileId: $TSFixMe;
  threshold: $TSFixMe;
  title: $TSFixMe;
  constructor({
    id,
    title,
    message,
    threshold,
    prescriberTitle,
    prescriberDescription,
    targetProfileId
  }: $TSFixMe = {}) {
    this.id = id;
    this.title = title;
    this.message = message;
    this.threshold = threshold;
    this.prescriberTitle = prescriberTitle;
    this.prescriberDescription = prescriberDescription;
    this.targetProfileId = targetProfileId;
  }
}

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = Stage;
