// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'NotFoundEr... Remove this comment to see the full error message
const { NotFoundError } = require('../errors');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Complement... Remove this comment to see the full error message
const ComplementaryCertificationCourseResult = require('../models/ComplementaryCertificationCourseResult');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = async function saveJuryComplementaryCertificationCourseResult({
  complementaryCertificationCourseId,
  juryLevel,
  complementaryCertificationCourseResultRepository
}: $TSFixMe) {
  const complementaryCertificationCourseResults =
    await complementaryCertificationCourseResultRepository.getFromComplementaryCertificationCourseId({
      complementaryCertificationCourseId,
    });

  const pixEduAndFromPixSourceComplementaryCertificationCourseResult = complementaryCertificationCourseResults.find(
    (complementaryCertificationCourseResult: $TSFixMe) => complementaryCertificationCourseResult.isPixEdu() && complementaryCertificationCourseResult.isFromPixSource()
  );

  if (!pixEduAndFromPixSourceComplementaryCertificationCourseResult) {
    // @ts-expect-error TS(2554): Expected 3 arguments, but got 1.
    throw new NotFoundError("Aucun résultat Pix+ Edu n'a été trouvé pour cette certification.");
  }

  const { partnerKey: pixPartnerKey } = pixEduAndFromPixSourceComplementaryCertificationCourseResult;

  const externalComplementaryCertificationCourseResult = ComplementaryCertificationCourseResult.buildFromJuryLevel({
    juryLevel,
    pixPartnerKey,
    complementaryCertificationCourseId,
  });

  return complementaryCertificationCourseResultRepository.save(externalComplementaryCertificationCourseResult);
};
