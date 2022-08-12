// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Serializer... Remove this comment to see the full error message
const { Serializer } = require('jsonapi-serializer');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'WrongDateF... Remove this comment to see the full error message
const { WrongDateFormatError } = require('../../../domain/errors');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'isValidDat... Remove this comment to see the full error message
const { isValidDate } = require('../../utils/date-utils');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Session'.
const Session = require('../../../domain/models/Session');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  serialize(sessions: $TSFixMe, hasSupervisorAccess: $TSFixMe) {
    const attributes = [
      'address',
      'room',
      'examiner',
      'date',
      'time',
      'status',
      'description',
      'accessCode',
      'examinerGlobalComment',
      'hasIncident',
      'hasJoiningIssue',
      'finalizedAt',
      'resultsSentToPrescriberAt',
      'publishedAt',
      'certificationCenterId',
      'certificationCandidates',
      'certificationReports',
      'supervisorPassword',
      'hasSupervisorAccess',
    ];
    return new Serializer('session', {
      transform(record: $TSFixMe) {
        if (hasSupervisorAccess !== undefined) {
          record.hasSupervisorAccess = hasSupervisorAccess;
        }
        return record;
      },
      attributes,
      certificationCandidates: {
        ref: 'id',
        ignoreRelationshipData: true,
        relationshipLinks: {
          related(record: $TSFixMe, current: $TSFixMe, parent: $TSFixMe) {
            return `/api/sessions/${parent.id}/certification-candidates`;
          },
        },
      },
      certificationReports: {
        ref: 'id',
        ignoreRelationshipData: true,
        nullIfMissing: true,
        relationshipLinks: {
          related(record: $TSFixMe, current: $TSFixMe, parent: $TSFixMe) {
            return `/api/sessions/${parent.id}/certification-reports`;
          },
        },
      },
    }).serialize(sessions);
  },

  deserialize(json: $TSFixMe) {
    const attributes = json.data.attributes;
    if (!isValidDate(attributes.date, 'YYYY-MM-DD')) {
      throw new WrongDateFormatError();
    }

    const result = new Session({
      id: json.data.id,
      certificationCenterId: attributes['certification-center-id'],
      address: attributes.address,
      room: attributes.room,
      examiner: attributes.examiner,
      date: attributes.date,
      time: attributes.time,
      status: attributes.status,
      description: attributes.description,
      examinerGlobalComment: attributes['examiner-global-comment'],
      hasIncident: attributes['has-incident'],
      hasJoiningIssue: attributes['has-joining-issue'],
    });

    if (_.isEmpty(_.trim(result.examinerGlobalComment))) {
      result.examinerGlobalComment = (Session as $TSFixMe).NO_EXAMINER_GLOBAL_COMMENT;
    }

    return result;
  },
};
