// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'buildSkill... Remove this comment to see the full error message
const buildSkill = require('./build-skill');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Certificat... Remove this comment to see the full error message
const CertificationChallenge = require('../../../../lib/domain/models/CertificationChallenge');

const buildCertificationChallenge = function ({
  id = 123,
  challengeId = 'recCHAL',
  competenceId = 'recCOMP',
  courseId = 456,
  associatedSkillId = buildSkill().id,
  associatedSkillName = buildSkill().name,
  isNeutralized = false,
  certifiableBadgeKey = null,
} = {}) {
  return new CertificationChallenge({
    id,
    challengeId,
    competenceId,
    courseId,
    associatedSkillId,
    associatedSkillName,
    isNeutralized,
    certifiableBadgeKey,
  });
};

buildCertificationChallenge.forPixCertification = function ({
  challengeId = 'recCHAL',
  competenceId = 'recCOMP',
  associatedSkillId = buildSkill().id,
  associatedSkillName = buildSkill().name,
} = {}) {
  return new CertificationChallenge({
    id: undefined,
    courseId: undefined,
    associatedSkillName,
    associatedSkillId,
    challengeId,
    competenceId,
    isNeutralized: false,
    certifiableBadgeKey: null,
  });
};

buildCertificationChallenge.forPixPlusCertification = function ({
  challengeId = 'recCHAL',
  competenceId = 'recCOMP',
  associatedSkillId = buildSkill().id,
  associatedSkillName = buildSkill().name,
  certifiableBadgeKey = 'certifiableBadgeKey',
} = {}) {
  return new CertificationChallenge({
    id: undefined,
    courseId: undefined,
    associatedSkillName,
    associatedSkillId,
    challengeId,
    competenceId,
    isNeutralized: false,
    certifiableBadgeKey,
  });
};

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = buildCertificationChallenge;
