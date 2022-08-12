// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'knex'.
const { knex } = require('../bookshelf');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'JuryCertif... Remove this comment to see the full error message
const JuryCertificationSummary = require('../../domain/read-models/JuryCertificationSummary');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Certificat... Remove this comment to see the full error message
const CertificationIssueReport = require('../../domain/models/CertificationIssueReport');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Complement... Remove this comment to see the full error message
const ComplementaryCertificationCourseResult = require('../../domain/models/ComplementaryCertificationCourseResult');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Assessment... Remove this comment to see the full error message
const Assessment = require('../../domain/models/Assessment');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  async findBySessionId(sessionId: $TSFixMe) {
    const juryCertificationSummaryRows = await knex
      .select('certification-courses.*', 'assessment-results.pixScore')
      .select({
        assessmentResultStatus: 'assessment-results.status',
        assessmentState: 'assessments.state',
      })
      .select(
        knex.raw(
          `json_agg("complementary-certification-course-results".*) over (partition by "certification-courses".id) as "complementaryCertificationCourseResults"`
        )
      )
      .from('certification-courses')
      .leftJoin('assessments', 'assessments.certificationCourseId', 'certification-courses.id')
      .leftJoin('assessment-results', 'assessment-results.assessmentId', 'assessments.id')
      .modify(_filterMostRecentAssessmentResult)
      .leftJoin(
        'complementary-certification-courses',
        'complementary-certification-courses.certificationCourseId',
        'certification-courses.id'
      )
      .leftJoin(
        'complementary-certification-course-results',
        'complementary-certification-course-results.complementaryCertificationCourseId',
        'complementary-certification-courses.id'
      )

      .where('certification-courses.sessionId', sessionId)
      .orderBy('lastName', 'ASC')
      .orderBy('firstName', 'ASC');

    const certificationCourseIds = juryCertificationSummaryRows.map((row: $TSFixMe) => row.id);
    const certificationIssueReportRows = await knex('certification-issue-reports').whereIn(
      'certificationCourseId',
      certificationCourseIds
    );

    const juryCertificationSummaryDTOs = _buildJuryCertificationSummaryDTOs(
      juryCertificationSummaryRows,
      certificationIssueReportRows
    );

    return _.map(juryCertificationSummaryDTOs, _toDomain);
  },
};

function _filterMostRecentAssessmentResult(qb: $TSFixMe) {
  return qb.whereNotExists(
    knex
      .select(1)
      .from({ 'last-assessment-results': 'assessment-results' })
      .whereRaw('"last-assessment-results"."assessmentId" = assessments.id')
      .whereRaw('"assessment-results"."createdAt" < "last-assessment-results"."createdAt"')
  );
}

function _buildJuryCertificationSummaryDTOs(juryCertificationSummaryRows: $TSFixMe, certificationIssueReportRows: $TSFixMe) {
  return juryCertificationSummaryRows.map((juryCertificationSummaryRow: $TSFixMe) => {
    const matchingCertificationIssueReportRows = _.filter(certificationIssueReportRows, {
      certificationCourseId: juryCertificationSummaryRow.id,
    });
    return {
      ...juryCertificationSummaryRow,
      certificationIssueReports: matchingCertificationIssueReportRows.map((certificationIssueReportRow: $TSFixMe) => ({
        ...certificationIssueReportRow
      })),
    };
  });
}

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable '_toDomain'... Remove this comment to see the full error message
function _toDomain(juryCertificationSummaryDTO: $TSFixMe) {
  const certificationIssueReports = juryCertificationSummaryDTO.certificationIssueReports.map(
    (certificationIssueReportDTO: $TSFixMe) => {
      return new CertificationIssueReport(certificationIssueReportDTO);
    }
  );

  const complementaryCertificationCourseResults = _.compact(
    juryCertificationSummaryDTO.complementaryCertificationCourseResults
  ).map(ComplementaryCertificationCourseResult.from);

  return new JuryCertificationSummary({
    ...juryCertificationSummaryDTO,
    status: juryCertificationSummaryDTO.assessmentResultStatus,
    isCourseCancelled: juryCertificationSummaryDTO.isCancelled,
    isEndedBySupervisor: juryCertificationSummaryDTO.assessmentState === Assessment.states.ENDED_BY_SUPERVISOR,
    certificationIssueReports,
    complementaryCertificationCourseResults,
  });
}
