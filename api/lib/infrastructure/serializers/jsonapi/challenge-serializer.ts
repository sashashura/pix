// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Serializer... Remove this comment to see the full error message
const { Serializer } = require('jsonapi-serializer');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  serialize(challenges: $TSFixMe) {
    return new Serializer('challenge', {
      attributes: [
        'type',
        'instruction',
        'competence',
        'proposals',
        'timer',
        'illustrationUrl',
        'attachments',
        'competence',
        'embedUrl',
        'embedTitle',
        'embedHeight',
        'illustrationAlt',
        'format',
        'autoReply',
        'alternativeInstruction',
        'focused',
      ],
      transform: (record: $TSFixMe) => {
        const challenge = _.pickBy(record, (value: $TSFixMe) => !_.isUndefined(value));

        challenge.competence = challenge.competenceId || 'N/A';

        return challenge;
      },
    }).serialize(challenges);
  },
};
