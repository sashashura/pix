import Route from '@ember/routing/route';

export default class SessionCertificationsRoute extends Route {
  queryParams = {
    pageNumber: { refreshModel: true },
    pageSize: { refreshModel: true },
    id: { refreshModel: true },
    firstName: { refreshModel: true },
    lastName: { refreshModel: true },
    pixScore: { refreshModel: true },
  };

  async model(params) {
    const session = this.modelFor('authenticated.sessions.session');
    await session.hasMany('juryCertificationSummaries').reload({ adapterOptions: {
      'page[size]': params.pageSize,
      'page[number]': params.pageNumber,
      'filter[firstName]': params.firstName,
      'filter[lastName]': params.lastName,
      'filter[id]': params.id,
      'filter[pixScore]': params.pixScore,
    } });
    return session;
  }

  resetController(controller, isExiting) {
    if (isExiting) {
      controller.pageNumber = 1;
      controller.pageSize = 10;
      controller.id = null;
      controller.firstName = null;
      controller.lastName = null;
      controller.pixScore = null;
    }
  }
}
