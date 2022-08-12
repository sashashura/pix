// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Training'.
class Training {
  duration: $TSFixMe;
  id: $TSFixMe;
  link: $TSFixMe;
  locale: $TSFixMe;
  targetProfileIds: $TSFixMe;
  title: $TSFixMe;
  type: $TSFixMe;
  constructor({
    id,
    title,
    link,
    type,
    duration,
    locale,
    targetProfileIds
  }: $TSFixMe = {}) {
    this.id = id;
    this.title = title;
    this.link = link;
    this.type = type;
    this.duration = duration;
    this.locale = locale;
    this.targetProfileIds = targetProfileIds;
  }
}

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = Training;
