// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = async function importSupOrganizationLearners({
  supOrganizationLearnerRepository,
  supOrganizationLearnerParser
}: $TSFixMe) {
  const { learners, warnings } = supOrganizationLearnerParser.parse();

  await supOrganizationLearnerRepository.addStudents(learners);

  return warnings;
};
