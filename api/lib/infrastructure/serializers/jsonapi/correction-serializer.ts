// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Serializer... Remove this comment to see the full error message
const { Serializer } = require('jsonapi-serializer');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'tutorialAt... Remove this comment to see the full error message
const tutorialAttributes = require('./tutorial-attributes');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  serialize(correction: $TSFixMe) {
    return new Serializer('corrections', {
      attributes: ['solution', 'solutionToDisplay', 'hint', 'tutorials', 'learningMoreTutorials'],
      tutorials: tutorialAttributes,
      learningMoreTutorials: tutorialAttributes,
      typeForAttribute(attribute: $TSFixMe) {
        switch (attribute) {
          case 'userTutorial':
            return 'user-tutorial';
          case 'learningMoreTutorials':
            return 'tutorials';
          default:
            return attribute;
        }
      },
      transform: (record: $TSFixMe) => {
        const correction = Object.assign({}, record);
        correction.hint = record.hint?.value;
        return correction;
      },
    }).serialize(correction);
  },
};
