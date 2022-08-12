// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'SCOCertifi... Remove this comment to see the full error message
const SCOCertificationCandidate = require('../models/SCOCertificationCandidate');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'ForbiddenA... Remove this comment to see the full error message
const { ForbiddenAccess, UnknownCountryForStudentEnrollmentError } = require('../errors');
const INSEE_PREFIX_CODE = '99';

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = async function enrollStudentsToSession({
  sessionId,
  referentId,
  studentIds,
  scoCertificationCandidateRepository,
  organizationLearnerRepository,
  organizationRepository,
  certificationCenterMembershipRepository,
  countryRepository,
  sessionRepository
}: $TSFixMe = {}) {
  const session = await sessionRepository.get(sessionId);
  const referentCertificationCenterMemberships = await certificationCenterMembershipRepository.findByUserId(referentId);

  if (!_doesSessionBelongToSameCertificationCenterAsReferent(referentCertificationCenterMemberships, session)) {
    throw new ForbiddenAccess('Impossible de modifier une session ne faisant pas partie de votre établissement');
  }

  const students = await organizationLearnerRepository.findByIds({ ids: studentIds });

  const doAllStudentsBelongToSameCertificationCenterAsSession =
    await _doAllStudentsBelongToSameCertificationCenterAsSession({ students, session, organizationRepository });
  if (!doAllStudentsBelongToSameCertificationCenterAsSession) {
    throw new ForbiddenAccess("Impossible d'inscrire un élève ne faisant pas partie de votre établissement");
  }

  const countries = await countryRepository.findAll();

  const scoCertificationCandidates = students.map((student: $TSFixMe) => {
    const studentInseeCountryCode = INSEE_PREFIX_CODE + student.birthCountryCode;

    const studentCountry = countries.find((country: $TSFixMe) => country.code === studentInseeCountryCode);

    if (!studentCountry)
      throw new UnknownCountryForStudentEnrollmentError({
        firstName: student.firstName.trim(),
        lastName: student.lastName.trim(),
      });

    return new SCOCertificationCandidate({
      firstName: student.firstName.trim(),
      lastName: student.lastName.trim(),
      birthdate: student.birthdate,
      birthINSEECode: student.birthCityCode,
      birthCountry: studentCountry.name,
      birthCity: student.birthCity,
      sex: student.sex,
      sessionId,
      organizationLearnerId: student.id,
    });
  });

  await scoCertificationCandidateRepository.addNonEnrolledCandidatesToSession({
    sessionId,
    scoCertificationCandidates,
  });
};

function _doesSessionBelongToSameCertificationCenterAsReferent(referentCertificationCenterMemberships: $TSFixMe, session: $TSFixMe) {
  return referentCertificationCenterMemberships.some(
    (membership: $TSFixMe) => membership.certificationCenter.id === session.certificationCenterId
  );
}

async function _doAllStudentsBelongToSameCertificationCenterAsSession({
  students,
  session,
  organizationRepository
}: $TSFixMe) {
  const certificationCenterId = session.certificationCenterId;
  const organizationId = await organizationRepository.getIdByCertificationCenterId(certificationCenterId);

  return _.every(students, (student: $TSFixMe) => organizationId === student.organizationId);
}
