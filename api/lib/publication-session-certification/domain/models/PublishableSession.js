module.exports = class PublishableSession {
  constructor({ id }) {
    this.id = id;
  }
};

// Empêcher d'importer un model hors du dossier (fils de lib) qui le défini
// exemple : depuis lib/publication-session-certification/domain/usecases/publish-session on peut importer lib/publication-session-certification/domain/models/PublisableSession
// exemple : depuis lib/application/sessions/session-controller.js on ne peut pas importer lib/publication-session-certification/domain/models/PublisableSession

