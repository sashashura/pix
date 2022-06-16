const { expect } = require('../../test-helper');
const { changeCase } = require('../../../lib/application/change-case');

describe('change case', function () {
  it('change the case for the camel case', async function () {
    const request = {
      payload: {
        data: {
          attributes: {
            'campaign-id': 1,
            'first-name': 'value',
            'resultat-thematique': {
              'last-name': 'value',
              other: null,
            },
          },
        },
      },
      params: { 'organization-id': 1 },
    };

    const parameters = changeCase(request);

    expect(parameters).to.deep.equal({
      payload: {
        data: {
          attributes: {
            campaignId: 1,
            firstName: 'value',
            resultatThematique: {
              lastName: 'value',
              other: null,
            },
          },
        },
      },
      params: { organizationId: 1 },
    });
  });
});
