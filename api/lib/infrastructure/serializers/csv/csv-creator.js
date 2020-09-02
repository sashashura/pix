const targetProfileRepository = require('../../repositories/target-profile-repository');
const competenceRepository = require('../../repositories/competence-repository');
const organizationRepository = require('../../repositories/organization-repository');
const campaignParticipationInfoRepository = require('../../repositories/campaign-participation-info-repository');
const campaignRepository = require('../../repositories/campaign-repository');

const _ = require('lodash');
const csvSerializer = require('./csv-serializer');
const knowledgeElementRepository = require('../../repositories/knowledge-element-repository');

class CsvCreator {
  constructor(stream, campaignId) {
    this.stream = stream;
    this.campaignId = campaignId;

  }

  async fetchData() {
    const campaign = await campaignRepository.get(this.campaignId);

    const [targetProfile, allCompetences, organization, campaignParticipationInfos] = await Promise.all([
      targetProfileRepository.get(campaign.targetProfileId),
      competenceRepository.list(),
      organizationRepository.get(campaign.organizationId),
      campaignParticipationInfoRepository.findByCampaignId(campaign.id),
    ]);

    this.targetProfile = targetProfile;
    this.allCompetences = allCompetences;
    this.organization = organization;
    this.campaignParticipationInfos = campaignParticipationInfos;
  }

  createHeaderOfCSV(skills, allCompetences, idPixLabel, organizationType, organizationIsManagingStudents) {
    const competences = this._extractCompetences(allCompetences, skills);
    const areas = this.extractAreas(competences);

    const headers = [
      'Nom de l\'organisation',
      'ID Campagne',
      'Nom de la campagne',
      'Nom du Profil Cible',
      'Nom du Participant',
      'Prénom du Participant',
      ...((organizationType === 'SUP' && organizationIsManagingStudents) ? ['Numéro Étudiant'] : []),

      ...(idPixLabel ? [idPixLabel] : []),

      '% de progression',
      'Date de début',
      'Partage (O/N)',
      'Date du partage',
      '% maitrise de l\'ensemble des acquis du profil',

      ...(_.flatMap(competences, (competence) => [
        `% de maitrise des acquis de la compétence ${competence.name}`,
        `Nombre d'acquis du profil cible dans la compétence ${competence.name}`,
        `Acquis maitrisés dans la compétence ${competence.name}`,
      ])),

      ...(_.flatMap(areas, (area) => [
        `% de maitrise des acquis du domaine ${area.title}`,
        `Nombre d'acquis du profil cible du domaine ${area.title}`,
        `Acquis maitrisés du domaine ${area.title}`,
      ])),

      ...(_.map(skills, 'name')),
    ];

    const headerLine = '\uFEFF' + csvSerializer.serializeLine(headers);
    this.stream.write(headerLine);
  }

  extractAreas(competences) {
    return _.uniqBy(competences.map((competence) => competence.area), 'code');
  }

  async createLine(campaignParticipationInfo, campaignCsvExportService, organization, campaign, allCompetences, targetProfile, skills) {
    const competences = this._extractCompetences(allCompetences, skills);
    const participantKnowledgeElements = await knowledgeElementRepository.findUniqByUserId({
      userId: campaignParticipationInfo.userId,
      limitDate: campaignParticipationInfo.sharedAt,
    });

    const csvLine = campaignCsvExportService.createOneCsvLine({
      organization,
      campaign,
      competences,
      campaignParticipationInfo,
      targetProfile,
      participantKnowledgeElements,
    });

    this.stream.write(csvLine);
  }

  _extractCompetences(allCompetences, skills) {
    return _(skills)
      .map('competenceId')
      .uniq()
      .map((competenceId) => {
        const competence = _.find(allCompetences, { id: competenceId });
        if (!competence) {
          throw new Error(`Unknown competence ${competenceId}`);
        }
        return competence;
      })
      .value();
  }
}

module.exports = CsvCreator;
