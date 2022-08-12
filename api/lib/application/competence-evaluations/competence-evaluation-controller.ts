// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'usecases'.
const usecases = require('../../domain/usecases');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'serializer... Remove this comment to see the full error message
const serializer = require('../../infrastructure/serializers/jsonapi/competence-evaluation-serializer');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'DomainTran... Remove this comment to see the full error message
const DomainTransaction = require('../../infrastructure/DomainTransaction');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  async startOrResume(request: $TSFixMe, h: $TSFixMe) {
    const userId = request.auth.credentials.userId;
    const competenceId = request.payload.competenceId;

    const { competenceEvaluation, created } = await usecases.startOrResumeCompetenceEvaluation({
      competenceId,
      userId,
    });
    const serializedCompetenceEvaluation = serializer.serialize(competenceEvaluation);

    return created ? h.response(serializedCompetenceEvaluation).created() : serializedCompetenceEvaluation;
  },

  async improve(request: $TSFixMe, h: $TSFixMe) {
    const userId = request.auth.credentials.userId;
    const competenceId = request.payload.competenceId;

    const competenceEvaluation = await DomainTransaction.execute(async (domainTransaction: $TSFixMe) => {
      const competenceEvaluation = await usecases.improveCompetenceEvaluation({
        competenceId,
        userId,
        domainTransaction,
      });
      return competenceEvaluation;
    });

    const serializedCompetenceEvaluation = serializer.serialize(competenceEvaluation);
    return h.response(serializedCompetenceEvaluation);
  },
};
