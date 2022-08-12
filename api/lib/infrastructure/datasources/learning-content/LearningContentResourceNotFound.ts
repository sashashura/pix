// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'LearningCo... Remove this comment to see the full error message
class LearningContentResourceNotFound extends Error {
  constructor() {
    super();
  }
}

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = LearningContentResourceNotFound;
