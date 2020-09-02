const bluebird = require('bluebird');
const moment = require('moment');

const targetProfileRepository = require('../../repositories/target-profile-repository');
const competenceRepository = require('../../repositories/competence-repository');
const organizationRepository = require('../../repositories/organization-repository');
const campaignParticipationInfoRepository = require('../../repositories/campaign-participation-info-repository');
const campaignCsvExportService = require('../../../domain/services/campaign-csv-export-service');
const constants = require('../../constants');

const _ = require('lodash');
const csvSerializer = require('./csv-serializer');
const knowledgeElementRepository = require('../../repositories/knowledge-element-repository');

class CsvCreator {
  constructor(stream, campaign) {
    this.stream = stream;
    this.campaign = campaign;
  }

  async startExport() {
    await this.fetchData();
    this.createHeaderOfCSV();
    this.createLines();
  }

  generateFilename() {
    const fileName = `Resultats-${this.campaign.name}-${this.campaign.id}-${moment.utc().
      format('YYYY-MM-DD-hhmm')}.csv`;
    return { fileName };
  }

  async fetchData() {

    const [targetProfile, allCompetences, organization, campaignParticipationInfos] = await Promise.all([
      targetProfileRepository.get(this.campaign.targetProfileId),
      competenceRepository.list(),
      organizationRepository.get(this.campaign.organizationId),
      campaignParticipationInfoRepository.findByCampaignId(this.campaign.id),
    ]);

    this.targetProfile = targetProfile;
    this.competences = this._extractCompetences(allCompetences, this.targetProfile.skills);
    this.organization = organization;
    this.areas = this.extractAreas(this.competences);
    this.campaignParticipationInfos = campaignParticipationInfos;
  }

  createHeaderOfCSV() {
    const headers = [
      'Nom de l\'organisation',
      'ID Campagne',
      'Nom de la campagne',
      'Nom du Profil Cible',
      'Nom du Participant',
      'Prénom du Participant',
      ...((this.organization.type === 'SUP' && this.organization.isManagingStudents) ? ['Numéro Étudiant'] : []),

      ...(this.campaign.idPixLabel ? [this.campaign.idPixLabel] : []),

      '% de progression',
      'Date de début',
      'Partage (O/N)',
      'Date du partage',
      '% maitrise de l\'ensemble des acquis du profil',

      ...(_.flatMap(this.competences, (competence) => [
        `% de maitrise des acquis de la compétence ${competence.name}`,
        `Nombre d'acquis du profil cible dans la compétence ${competence.name}`,
        `Acquis maitrisés dans la compétence ${competence.name}`,
      ])),

      ...(_.flatMap(this.areas, (area) => [
        `% de maitrise des acquis du domaine ${area.title}`,
        `Nombre d'acquis du profil cible du domaine ${area.title}`,
        `Acquis maitrisés du domaine ${area.title}`,
      ])),

      ...(_.map(this.targetProfile.skills, 'name')),
    ];

    const headerLine = '\uFEFF' + csvSerializer.serializeLine(headers);
    this.stream.write(headerLine);
  }

  extractAreas(competences) {
    return _.uniqBy(competences.map((competence) => competence.area), 'code');
  }

  async _createLine(campaignParticipationInfo) {
    const participantKnowledgeElements = await knowledgeElementRepository.findUniqByUserId({
      userId: campaignParticipationInfo.userId,
      limitDate: campaignParticipationInfo.sharedAt,
    });

    const csvLine = campaignCsvExportService.createOneCsvLine({
      organization: this.organization,
      campaign: this.campaign,
      competences: this.competences,
      campaignParticipationInfo,
      targetProfile: this.targetProfile,
      participantKnowledgeElements,
    });

    this.stream.write(csvLine);
  }

  _extractCompetences(allCompetences, skills) {
    return _(skills).map('competenceId').uniq().map((competenceId) => {
      const competence = _.find(allCompetences, { id: competenceId });
      if (!competence) {
        throw new Error(`Unknown competence ${competenceId}`);
      }
      return competence;
    }).value();
  }

  createLines() {
    bluebird.map(this.campaignParticipationInfos, async (campaignParticipationInfo) => {
      await this._createLine(campaignParticipationInfo);
    }, { concurrency: constants.CONCURRENCY_HEAVY_OPERATIONS }).then(() => {
      this.stream.end();
    }).catch((error) => {
      this.stream.emit('error', error);
      throw error;
    });
  }
}

module.exports = CsvCreator;
