// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Tutorial'.
class Tutorial {
  duration: $TSFixMe;
  format: $TSFixMe;
  id: $TSFixMe;
  link: $TSFixMe;
  source: $TSFixMe;
  title: $TSFixMe;
  constructor({
    id,
    duration,
    format,
    link,
    source,
    title
  }: $TSFixMe = {}) {
    this.id = id;
    this.duration = duration;
    this.format = format;
    this.link = link;
    this.source = source;
    this.title = title;
  }
}

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = Tutorial;
