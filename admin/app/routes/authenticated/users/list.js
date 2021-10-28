import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';

export default class ListRoute extends Route {
  @service store;

  queryParams = {
    pageNumber: { refreshModel: true },
    pageSize: { refreshModel: true },
    firstName: { refreshModel: true },
    lastName: { refreshModel: true },
    email: { refreshModel: true },
  };

  async model(params) {
    debugger;
    if (!params.firstName && !params.lastName && !params.email) return [];

    const result = await this.store.query('user', {
      filter: {
        firstName: params.firstName ? params.firstName.trim() : '',
        lastName: params.lastName ? params.lastName.trim() : '',
        email: params.email ? params.email.trim() : '',
      },
      page: {
        number: params.pageNumber,
        size: params.pageSize,
      },
    });
    console.log(result);

    return result;
  }

  resetController(controller, isExiting) {
    if (isExiting) {
      controller.pageNumber = 1;
      controller.pageSize = 10;
      controller.firstName = null;
      controller.lastName = null;
      controller.email = null;
    }
  }
}
