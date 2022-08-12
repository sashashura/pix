// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Assessment... Remove this comment to see the full error message
const AssessmentResult = require('../../domain/models/AssessmentResult');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Competence... Remove this comment to see the full error message
const CompetenceMark = require('../../domain/models/CompetenceMark');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'assessment... Remove this comment to see the full error message
const assessmentResultService = require('../../domain/services/assessment-result-service');

// TODO: Should be removed and replaced by a real serializer
function _deserializeResultsAdd(json: $TSFixMe) {
  const assessmentResult = new AssessmentResult({
    assessmentId: json['assessment-id'],
    emitter: json.emitter,
    status: json.status,
    commentForJury: json['comment-for-jury'],
    commentForCandidate: json['comment-for-candidate'],
    commentForOrganization: json['comment-for-organization'],
    pixScore: json['pix-score'],
  });

  const competenceMarks = json['competences-with-mark'].map((competenceMark: $TSFixMe) => {
    return new CompetenceMark({
      level: competenceMark.level,
      score: competenceMark.score,
      area_code: competenceMark.area_code,
      competence_code: competenceMark.competence_code,
      competenceId: competenceMark['competenceId'],
    });
  });
  return { assessmentResult, competenceMarks };
}

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  async save(request: $TSFixMe) {
    const jsonResult = request.payload.data.attributes;
    const { assessmentResult, competenceMarks } = _deserializeResultsAdd(jsonResult);
    const juryId = request.auth.credentials.userId;
    // FIXME (re)calculate partner certifications which may be invalidated/validated
    await assessmentResultService.save({ ...assessmentResult, juryId }, competenceMarks);
    return null;
  },
};
