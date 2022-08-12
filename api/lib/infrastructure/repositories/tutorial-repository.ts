// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Tutorial'.
const Tutorial = require('../../domain/models/Tutorial');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'userTutori... Remove this comment to see the full error message
const userTutorialRepository = require('./user-tutorial-repository');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'tutorialEv... Remove this comment to see the full error message
const tutorialEvaluationRepository = require('./tutorial-evaluation-repository');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'tutorialDa... Remove this comment to see the full error message
const tutorialDatasource = require('../datasources/learning-content/tutorial-datasource');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'NotFoundEr... Remove this comment to see the full error message
const { NotFoundError } = require('../../domain/errors');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'TutorialFo... Remove this comment to see the full error message
const TutorialForUser = require('../../domain/read-models/TutorialForUser');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'FRENCH_FRA... Remove this comment to see the full error message
const { FRENCH_FRANCE } = require('../../domain/constants').LOCALE;
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'knowledgeE... Remove this comment to see the full error message
const knowledgeElementRepository = require('./knowledge-element-repository');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'skillRepos... Remove this comment to see the full error message
const skillRepository = require('./skill-repository');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const paginateModule = require('../utils/paginate');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  async findByRecordIdsForCurrentUser({
    ids,
    userId,
    locale
  }: $TSFixMe) {
    const tutorials = await _findByRecordIds({ ids, locale });
    const userTutorials = await userTutorialRepository.find({ userId });
    const tutorialEvaluations = await tutorialEvaluationRepository.find({ userId });
    return _toTutorialsForUser({ tutorials, tutorialEvaluations, userTutorials });
  },

  async findByRecordIds(ids: $TSFixMe) {
    return _findByRecordIds({ ids });
  },

  async findPaginatedForCurrentUser({
    userId,
    page
  }: $TSFixMe) {
    const userTutorials = await userTutorialRepository.find({ userId });
    const [tutorials, tutorialEvaluations] = await Promise.all([
      tutorialDatasource.findByRecordIds(userTutorials.map(({
        tutorialId
      }: $TSFixMe) => tutorialId)),
      tutorialEvaluationRepository.find({ userId }),
    ]);

    const tutorialsForUser = _toTutorialsForUser({ tutorials, tutorialEvaluations, userTutorials });

    const sortedTutorialsForUser = _.orderBy(tutorialsForUser, ['userTutorial.createdAt'], ['desc']);
    const { results: models, pagination: meta } = paginateModule.paginate(sortedTutorialsForUser, page);

    return { models, meta };
  },

  async get(id: $TSFixMe) {
    try {
      const tutorialData = await tutorialDatasource.get(id);
      return _toDomain(tutorialData);
    } catch (error) {
      // @ts-expect-error TS(2554): Expected 3 arguments, but got 1.
      throw new NotFoundError('Tutorial not found');
    }
  },

  async list({ locale = FRENCH_FRANCE }) {
    let tutorialData = await tutorialDatasource.list();
    const lang = _extractLangFromLocale(locale);
    tutorialData = tutorialData.filter((tutorial: $TSFixMe) => _extractLangFromLocale(tutorial.locale) === lang);
    return _.map(tutorialData, _toDomain);
  },

  async findPaginatedRecommendedByUserId({
    userId,
    page,
    locale = FRENCH_FRANCE
  }: $TSFixMe = {}) {
    const invalidatedKnowledgeElements = await knowledgeElementRepository.findInvalidatedAndDirectByUserId(userId);

    const [userTutorials, tutorialEvaluations, skills] = await Promise.all([
      userTutorialRepository.find({ userId }),
      tutorialEvaluationRepository.find({ userId }),
      skillRepository.findOperativeByIds(invalidatedKnowledgeElements.map(({
        skillId
      }: $TSFixMe) => skillId)),
    ]);
    const tutorialsForUser = [];

    for (const skill of skills) {
      const tutorials = await _findByRecordIds({ ids: skill.tutorialIds, locale });

      tutorialsForUser.push(
        ..._toTutorialsForUser({ tutorials, tutorialEvaluations, userTutorials, skillId: skill.id })
      );
    }

    return paginateModule.paginate(tutorialsForUser, page);
  },
};

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable '_toDomain'... Remove this comment to see the full error message
function _toDomain(tutorialData: $TSFixMe) {
  return new Tutorial({
    id: tutorialData.id,
    duration: tutorialData.duration,
    format: tutorialData.format,
    link: tutorialData.link,
    source: tutorialData.source,
    title: tutorialData.title,
  });
}

function _toTutorialsForUser({
  tutorials,
  tutorialEvaluations,
  userTutorials,
  skillId
}: $TSFixMe) {
  return tutorials.map((tutorial: $TSFixMe) => {
    const userTutorial = userTutorials.find(({
      tutorialId
    }: $TSFixMe) => tutorialId === tutorial.id);
    const tutorialEvaluation = tutorialEvaluations.find(({
      tutorialId
    }: $TSFixMe) => tutorialId === tutorial.id);
    return new TutorialForUser({ ...tutorial, userTutorial, tutorialEvaluation, skillId });
  });
}

async function _findByRecordIds({
  ids,
  locale
}: $TSFixMe) {
  let tutorialData = await tutorialDatasource.findByRecordIds(ids);
  if (locale) {
    const lang = _extractLangFromLocale(locale);
    tutorialData = tutorialData.filter((tutorial: $TSFixMe) => _extractLangFromLocale(tutorial.locale) === lang);
  }
  return _.map(tutorialData, (tutorialData: $TSFixMe) => _toDomain(tutorialData));
}

function _extractLangFromLocale(locale: $TSFixMe) {
  return locale && locale.split('-')[0];
}
