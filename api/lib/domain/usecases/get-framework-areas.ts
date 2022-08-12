// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = async function getFrameworkAreas({
  frameworkId,
  frameworkName,
  locale,
  challengeRepository,
  tubeRepository,
  thematicRepository,
  areaRepository,
  frameworkRepository
}: $TSFixMe) {
  if (!frameworkId) {
    const framework = await frameworkRepository.getByName(frameworkName);
    frameworkId = framework.id;
  }

  const areasWithCompetences = await areaRepository.findByFrameworkIdWithCompetences({ frameworkId, locale });

  const competences = areasWithCompetences.flatMap((area: $TSFixMe) => area.competences);

  // @ts-expect-error TS(7031): Binding element 'competenceId' implicitly has an '... Remove this comment to see the full error message
  const competenceIds = competences.map(({ id: competenceId }) => competenceId);
  const thematics = await thematicRepository.findByCompetenceIds(competenceIds, locale);

  const tubeIds = thematics.flatMap((thematic: $TSFixMe) => thematic.tubeIds);
  const tubes = await tubeRepository.findActiveByRecordIds(tubeIds, locale);

  const validatedChallenges = await challengeRepository.findValidatedPrototype();

  const tubesWithResponsiveStatus = tubes.map((tube: $TSFixMe) => {
    const tubeChallenges = validatedChallenges.filter((challenge: $TSFixMe) => {
      return challenge.skill.tubeId === tube.id;
    });
    tube.mobile = _areChallengesMobileResponsive(tubeChallenges);
    tube.tablet = _areChallengesTabletResponsive(tubeChallenges);
    return tube;
  });

  return { areas: areasWithCompetences, thematics, tubes: tubesWithResponsiveStatus };
};

function _areChallengesMobileResponsive(challenges: $TSFixMe) {
  return _areChallengesResponsive(challenges, 'Smartphone');
}

function _areChallengesTabletResponsive(challenges: $TSFixMe) {
  return _areChallengesResponsive(challenges, 'Tablet');
}

function _areChallengesResponsive(challenges: $TSFixMe, type: $TSFixMe) {
  return challenges.length > 0 &&
  challenges.every((challenge: $TSFixMe) => {
    return challenge.responsive?.includes(type);
  });
}
