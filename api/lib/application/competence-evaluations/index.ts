// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'competence... Remove this comment to see the full error message
const competenceEvaluationController = require('./competence-evaluation-controller');

// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.register = async function (server: $TSFixMe) {
  server.route([
    {
      method: 'POST',
      path: '/api/competence-evaluations/start-or-resume',
      config: {
        handler: competenceEvaluationController.startOrResume,
        notes: [
          '- **Route nécessitant une authentification**\n' +
            "- S'il existe déjà une évaluation de competences pour l'utilisateur courant, alors cette route renvoie l'évaluation de competence existante avec un code 200\n" +
            "- Sinon, crée une évaluation de competences pour l'utilisateur courant, et la renvoie avec un code 201\n",
        ],
        tags: ['api', 'competence-evaluations'],
      },
    },
    {
      method: 'PUT',
      path: '/api/competence-evaluations/improve',
      config: {
        handler: competenceEvaluationController.improve,
        notes: [
          '- **Route nécessitant une authentification**\n' +
            "- Cette route renvoie l'évaluation de competences existante avec un code 200\n",
        ],
        tags: ['api', 'competence-evaluations'],
      },
    },
  ]);
};

// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.name = 'competence-evaluations-api';
