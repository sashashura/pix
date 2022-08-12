// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Serializer... Remove this comment to see the full error message
const { Serializer } = require('jsonapi-serializer');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  serialize(juryCertification: $TSFixMe) {
    return new Serializer('certifications', {
      transform(juryCertification: $TSFixMe) {
        return {
          id: juryCertification.certificationCourseId,
          ...juryCertification,
          competencesWithMark: juryCertification.competenceMarks,
        };
      },
      attributes: [
        'sessionId',
        'assessmentId',
        'userId',
        'firstName',
        'lastName',
        'birthdate',
        'sex',
        'birthplace',
        'birthCountry',
        'birthINSEECode',
        'birthPostalCode',
        'createdAt',
        'completedAt',
        'status',
        'isPublished',
        'juryId',
        'pixScore',
        'competencesWithMark',
        'commentForCandidate',
        'commentForOrganization',
        'commentForJury',
        'commonComplementaryCertificationCourseResults',
        'complementaryCertificationCourseResultsWithExternal',
        'certificationIssueReports',
      ],

      commonComplementaryCertificationCourseResults: {
        ref: 'id',
        attributes: ['label', 'status'],
      },
      complementaryCertificationCourseResultsWithExternal: {
        ref: 'complementaryCertificationCourseId',
        attributes: [
          'complementaryCertificationCourseId',
          'pixResult',
          'externalResult',
          'finalResult',
          'allowedExternalLevels',
        ],
      },
      certificationIssueReports: {
        ref: 'id',
        attributes: [
          'category',
          'description',
          'subcategory',
          'questionNumber',
          'isImpactful',
          'resolvedAt',
          'resolution',
          'hasBeenAutomaticallyResolved',
        ],
      },
    }).serialize(juryCertification);
  },
};
