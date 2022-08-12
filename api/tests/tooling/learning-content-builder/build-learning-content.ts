// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'FRENCH_FRA... Remove this comment to see the full error message
const { FRENCH_FRANCE, FRENCH_SPOKEN, ENGLISH_SPOKEN } = require('../../../lib/domain/constants').LOCALE;

const buildLearningContent = function (learningContent: $TSFixMe) {
  const allCompetences: $TSFixMe = [];
  const allTubes: $TSFixMe = [];
  const allSkills: $TSFixMe = [];
  const allChallenges: $TSFixMe = [];
  const allCourses: $TSFixMe = [];
  const allTutorials: $TSFixMe = [];
  const allThematics: $TSFixMe = [];
  const allTrainings: $TSFixMe = [];

  const areas = learningContent.map((area: $TSFixMe) => {
    const competences = area.competences.map((competence: $TSFixMe) => {
      const competenceSkills: $TSFixMe = [];
      function mapTubes(pTubes: $TSFixMe) {
        return pTubes &&
        pTubes.map((tube: $TSFixMe) => {
          const skills = tube.skills.map((skill: $TSFixMe) => {
            const tutorials =
              skill.tutorials &&
              skill.tutorials.map((tutorial: $TSFixMe) => {
                return {
                  id: tutorial.id,
                  title: tutorial.title,
                  format: tutorial.format,
                  source: tutorial.source,
                  link: tutorial.link,
                  locale: tutorial.locale,
                  duration: tutorial.duration,
                };
              });
            allTutorials.push(tutorials);
            const challenges =
              skill.challenges &&
              skill.challenges.map((challenge: $TSFixMe) => {
                return {
                  id: challenge.id,
                  competenceId: competence.id,
                  skillId: skill.id,
                  status: challenge.statut || 'validé',
                  solution: challenge.solution,
                  locales: _convertLanguesToLocales(challenge.langues || ['Francophone']),
                  type: challenge.type,
                  focusable: challenge.focusable,
                  instruction: challenge.instruction,
                  proposals: challenge.proposals,
                  autoReply: challenge.autoReply,
                  alpha: challenge.alpha,
                  delta: challenge.delta,
                };
              });
            allChallenges.push(challenges);
            return {
              id: skill.id,
              tubeId: tube.id,
              status: skill.status || 'actif',
              competenceId: competence.id,
              name: skill.nom,
              pixValue: skill.pixValue,
              tutorialIds: skill.tutorials && _.map(skill.tutorials, 'id'),
              version: skill.version,
              level: skill.level,
            };
          });
          competenceSkills.push(skills);
          allSkills.push(skills);
          return {
            id: tube.id,
            name: tube.name,
            description: tube.description,
            title: tube.title,
            practicalTitleFrFr: tube.practicalTitleFr || tube.practicalTitle,
            practicalDescriptionFrFr: tube.practicalDescriptionFr || tube.practicalDescription,
            practicalTitleEnUs: tube.practicalTitleEn || tube.practicalTitle,
            practicalDescriptionEnUs: tube.practicalDescriptionEn || tube.practicalDescription,
            competenceId: competence.id,
          };
        });
      }
      const tubes = mapTubes(competence.tubes);
      allTubes.push(tubes);
      const thematics =
        competence.thematics?.map((thematic: $TSFixMe) => {
          const tubes = mapTubes(thematic.tubes);
          allTubes.push(tubes);
          return {
            id: thematic.id,
            name: thematic.name,
            index: thematic.index,
            tubeIds: [],
          };
        }) ?? [];
      allThematics.push(thematics);
      return {
        id: competence.id,
        // @ts-expect-error TS(7006): Parameter 'skill' implicitly has an 'any' type.
        skillIds: competence.tubes && competenceSkills.flat().map((skill) => skill.id),
        areaId: area.id,
        origin: competence.origin || 'Pix',
        index: competence.index,
        nameFrFr: competence.nameFr || competence.name,
        nameEnUs: competence.nameEn || competence.name,
        descriptionFrFr: competence.descriptionFr || competence.description,
        descriptionEnUs: competence.descriptionEn || competence.description,
        thematicIds: thematics.map(({
          id
        }: $TSFixMe) => id),
      };
    });
    allCompetences.push(competences);
    const courses =
      area.courses &&
      area.courses.map((course: $TSFixMe) => {
        return {
          id: course.id,
          challenges: course.challengeIds,
          name: course.name,
          description: course.description,
        };
      });
    allCourses.push(courses);
    allTrainings.push(area.trainings);
    return {
      id: area.id,
      code: area.code,
      name: area.name,
      titleFrFr: area.titleFr,
      titleEnUs: area.titleEn,
      color: area.color,
      frameworkId: area.frameworkId,
      competenceIds: competences.map((competence: $TSFixMe) => competence.id),
    };
  });
  return {
    areas,
    competences: allCompetences.flat(),
    tubes: allTubes.flat(),
    skills: allSkills.flat(),
    challenges: _.compact(allChallenges.flat()),
    courses: _.compact(allCourses.flat()),
    tutorials: _.compact(allTutorials.flat()),
    thematics: allThematics.flat(),
    trainings: allTrainings.flat(),
  };
};

function _convertLanguesToLocales(langues: $TSFixMe) {
  return langues.map((langue: $TSFixMe) => {
    if (langue === 'Francophone') {
      return FRENCH_SPOKEN;
    }
    if (langue === 'Franco Français') {
      return FRENCH_FRANCE;
    }
    if (langue === 'Anglais') {
      return ENGLISH_SPOKEN;
    }
  });
}

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = buildLearningContent;
