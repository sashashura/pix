// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'ReachedSta... Remove this comment to see the full error message
class ReachedStage {
  id: $TSFixMe;
  message: $TSFixMe;
  starCount: $TSFixMe;
  threshold: $TSFixMe;
  title: $TSFixMe;
  constructor(masteryRate: $TSFixMe, stages: $TSFixMe) {
    const stagesOrdered = stages.sort((a: $TSFixMe, b: $TSFixMe) => a.threshold - b.threshold);
    const stagesReached = stagesOrdered.filter(({
      threshold
    }: $TSFixMe) => threshold <= masteryRate * 100);
    const lastStageReached = stagesReached[stagesReached.length - 1];

    this.id = lastStageReached.id;
    this.title = lastStageReached.title;
    this.message = lastStageReached.message;
    this.threshold = lastStageReached.threshold;

    this.starCount = stagesReached.length;
  }
}

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = ReachedStage;
