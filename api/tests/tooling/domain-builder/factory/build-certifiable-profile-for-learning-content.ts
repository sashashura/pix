// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Certifiabl... Remove this comment to see the full error message
const CertifiableProfileForLearningContent = require('../../../../lib/domain/models/CertifiableProfileForLearningContent');

const buildCertifiableProfileForLearningContent = function ({
  targetProfileWithLearningContent,
  knowledgeElements,
  answerAndChallengeIdsByAnswerId
}: $TSFixMe = {}) {
  return new CertifiableProfileForLearningContent({
    targetProfileWithLearningContent,
    knowledgeElements,
    answerAndChallengeIdsByAnswerId,
  });
};

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = buildCertifiableProfileForLearningContent;
