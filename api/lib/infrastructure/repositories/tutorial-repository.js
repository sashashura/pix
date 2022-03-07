const _ = require('lodash');
const Tutorial = require('../../domain/models/Tutorial');
const userTutorialRepository = require('./user-tutorial-repository');
const tutorialEvaluationRepository = require('./tutorial-evaluation-repository');
const tutorialDatasource = require('../datasources/learning-content/tutorial-datasource');
const { NotFoundError } = require('../../domain/errors');
const TutorialWithUserSavedTutorial = require('../../domain/models/TutorialWithUserSavedTutorial');
const { FRENCH_FRANCE } = require('../../domain/constants').LOCALE;
const knowledgeElementRepository = require('./knowledge-element-repository');
const skillRepository = require('./skill-repository');
const { knex } = require('../bookshelf');
const KnowledgeElement = require('../../domain/models/KnowledgeElement');

module.exports = {
  async findByRecordIdsForCurrentUser({ ids, userId, locale }) {
    const tutorials = await _findByRecordIds({ ids, locale });
    const userSavedTutorials = await userTutorialRepository.find({ userId });
    const tutorialEvaluations = await tutorialEvaluationRepository.find({ userId });
    _.forEach(tutorials, _assignUserInformation(userSavedTutorials, tutorialEvaluations));
    return tutorials;
  },

  async findByRecordIds(ids) {
    return _findByRecordIds({ ids });
  },

  async findPaginatedWithUserTutorialForCurrentUser({ userId, page }) {
    const { models: userTutorials, meta } = await userTutorialRepository.findPaginated({ userId, page });
    const tutorials = await tutorialDatasource.findByRecordIds(userTutorials.map(({ tutorialId }) => tutorialId));

    const tutorialsWithUserSavedTutorial = tutorials.map((tutorial) => {
      const userTutorial = userTutorials.find(({ tutorialId }) => tutorialId === tutorial.id);
      return new TutorialWithUserSavedTutorial({ ...tutorial, userTutorial });
    });

    return { models: tutorialsWithUserSavedTutorial, meta };
  },

  async get(id) {
    try {
      const tutorialData = await tutorialDatasource.get(id);
      return _toDomain(tutorialData);
    } catch (error) {
      throw new NotFoundError('Tutorial not found');
    }
  },

  async list({ locale = FRENCH_FRANCE }) {
    let tutorialData = await tutorialDatasource.list();
    const lang = _extractLangFromLocale(locale);
    tutorialData = tutorialData.filter((tutorial) => _extractLangFromLocale(tutorial.locale) === lang);
    return _.map(tutorialData, _toDomain);
  },

  async findRecommendedByUserId({ userId, locale = FRENCH_FRANCE } = {}) {
    const results = await knex('knowledge-elements')
      .select('learningcontent.tutorials.*')
      .join('learningcontent.skills', 'learningcontent.skills.id', '=', 'knowledge-elements.skillId')
      .join(
        'learningcontent.skills_tutorials',
        'learningcontent.skills_tutorials.skillId',
        '=',
        'learningcontent.skills.id'
      )
      .join(
        'learningcontent.tutorials',
        'learningcontent.tutorials.id',
        '=',
        'learningcontent.skills_tutorials.tutorialId'
      )
      .where({
        'knowledge-elements.userId': userId,
        'knowledge-elements.status': KnowledgeElement.StatusType.INVALIDATED,
        'knowledge-elements.source': KnowledgeElement.SourceType.DIRECT,
      })
      .whereIn('learningcontent.skills.status', ['actif', 'archivé']);

    return results.map(_toDomain);
  },
};

function _toDomain(tutorialData) {
  return new Tutorial({
    id: tutorialData.id,
    duration: tutorialData.duration,
    format: tutorialData.format,
    link: tutorialData.link,
    source: tutorialData.source,
    title: tutorialData.title,
  });
}

async function _findByRecordIds({ ids, locale }) {
  let tutorialData = await tutorialDatasource.findByRecordIds(ids);
  if (locale) {
    const lang = _extractLangFromLocale(locale);
    tutorialData = tutorialData.filter((tutorial) => _extractLangFromLocale(tutorial.locale) === lang);
  }
  return _.map(tutorialData, (tutorialData) => _toDomain(tutorialData));
}

function _extractLangFromLocale(locale) {
  return locale && locale.split('-')[0];
}

function _getUserSavedTutorial(userSavedTutorials, tutorial) {
  return _.find(userSavedTutorials, (userSavedTutorial) => userSavedTutorial.tutorialId === tutorial.id);
}

function _getTutorialEvaluation(tutorialEvaluations, tutorial) {
  return _.find(tutorialEvaluations, (tutorialEvaluation) => tutorialEvaluation.tutorialId === tutorial.id);
}

function _assignUserInformation(userSavedTutorials, tutorialEvaluations) {
  return (tutorial) => {
    const userSavedTutorial = _getUserSavedTutorial(userSavedTutorials, tutorial);
    if (userSavedTutorial) {
      tutorial.userTutorial = userSavedTutorial;
    }
    const tutorialEvaluation = _getTutorialEvaluation(tutorialEvaluations, tutorial);
    if (tutorialEvaluation) {
      tutorial.tutorialEvaluation = tutorialEvaluation;
    }
  };
}
