// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Serializer... Remove this comment to see the full error message
const { Serializer } = require('jsonapi-serializer');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  serializeForPaginatedList(jurySessionsForPaginatedList: $TSFixMe) {
    const { jurySessions, pagination } = jurySessionsForPaginatedList;
    return this.serialize(jurySessions, undefined, pagination);
  },

  serialize(jurySessions: $TSFixMe, hasSupervisorAccess: $TSFixMe, meta: $TSFixMe) {
    return new Serializer('sessions', {
      attributes: [
        'certificationCenterName',
        'certificationCenterType',
        'certificationCenterId',
        'certificationCenterExternalId',
        'address',
        'room',
        'examiner',
        'date',
        'time',
        'accessCode',
        'status',
        'description',
        'examinerGlobalComment',
        'finalizedAt',
        'resultsSentToPrescriberAt',
        'publishedAt',
        'juryComment',
        'juryCommentAuthorId',
        'juryCommentedAt',
        'hasSupervisorAccess',
        'hasJoiningIssue',
        'hasIncident',
        // included
        'assignedCertificationOfficer',
        'juryCommentAuthor',
        // links
        'juryCertificationSummaries',
      ],
      juryCertificationSummaries: {
        ref: 'id',
        ignoreRelationshipData: true,
        nullIfMissing: true,
        relationshipLinks: {
          related(record: $TSFixMe, current: $TSFixMe, parent: $TSFixMe) {
            return `/api/admin/sessions/${parent.id}/jury-certification-summaries`;
          },
        },
      },
      assignedCertificationOfficer: {
        ref: 'id',
        included: true,
        attributes: ['firstName', 'lastName'],
      },
      juryCommentAuthor: {
        ref: 'id',
        included: true,
        attributes: ['firstName', 'lastName'],
      },
      transform(jurySession: $TSFixMe) {
        const transformedJurySession = Object.assign({}, jurySession);
        transformedJurySession.status = jurySession.status;
        if (hasSupervisorAccess !== undefined) {
          transformedJurySession.hasSupervisorAccess = hasSupervisorAccess;
        }
        return transformedJurySession;
      },
      typeForAttribute: function (attribute: $TSFixMe) {
        if (attribute === 'assignedCertificationOfficer') {
          return 'user';
        }
        if (attribute === 'juryCommentAuthor') {
          return 'user';
        }
        return attribute;
      },
      meta,
    }).serialize(jurySessions);
  },
};
