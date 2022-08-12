// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Participat... Remove this comment to see the full error message
class ParticipationResultCalculationJobHandler {
  campaignParticipationRepository: $TSFixMe;
  participantResultsSharedRepository: $TSFixMe;
  constructor({
    participantResultsSharedRepository,
    campaignParticipationRepository
  }: $TSFixMe) {
    this.participantResultsSharedRepository = participantResultsSharedRepository;
    this.campaignParticipationRepository = campaignParticipationRepository;
  }

  async handle(event: $TSFixMe) {
    const { campaignParticipationId } = event;
    const participantResultsShared = await this.participantResultsSharedRepository.get(campaignParticipationId);
    await this.campaignParticipationRepository.update(participantResultsShared);
  }
}

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = ParticipationResultCalculationJobHandler;
