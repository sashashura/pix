const chai = require('chai');
const expect = chai.expect;
const axios = require('axios');
const nock = require('nock');
const { knex } = require('../../../db/knex-database-connection');
const DatabaseBuilder = require('../../../db/database-builder/database-builder');
const { generateAuthorizationHeader, createAccessToken } = require('../tooling');

function mockLearningContent(learningContent) {
  nock('https://lcms-test.pix.fr/api')
    .get('/current-content')
    .matchHeader('Authorization', 'Bearer test-api-key')
    .reply(200, learningContent);
}

const databaseBuilder = new DatabaseBuilder({ knex });

describe('POST /{id}/attach-organizations', () => {
  const learningContent = {
    areas: [{ id: 'recArea1', competenceIds: ['recArea1_Competence1'] }],
    competences: [{
      id: 'recArea1_Competence1',
      areaId: 'recArea1',
      skillIds: ['skillId'],
      origin: 'Pix',
    }],
    tubes: [{
      id: 'recArea1_Competence1_Tube1',
      competenceId: 'recArea1_Competence1',
    }],
    skills: [{
      id: 'skillId',
      name: '@recArea1_Competence1_Tube1_Skill1',
      status: 'actif',
      tubeId: 'recArea1_Competence1_Tube1',
      competenceId: 'recArea1_Competence1',
    }],
  };

  beforeEach(async function() {
    this.timeout(3000);
    mockLearningContent(learningContent);
  });

  afterEach(async function() {
    await knex('target-profile-shares').delete();
    await databaseBuilder.clean();
  });

  it('returns 204 when everything is OK', async function() {

    // eslint-disable-next-line no-sync
    const userData = { email: 'sco@example.net', rawPassword: 'Azerty123', scope: 'pix-admin' };

    const user = databaseBuilder.factory.buildUser.withPixRolePixMaster(userData);
    const targetProfile = databaseBuilder.factory.buildTargetProfile();
    const organization = databaseBuilder.factory.buildOrganization();
    await databaseBuilder.commit();

    const accessToken = await createAccessToken({ email: userData.email, password: userData.rawPassword, scope: userData.scope });

    const config = {
      headers: { Authorization: `Bearer ${accessToken}` },
    };

    const body = { 'organization-ids': [organization.id] };

    const requestUrl = `http://localhost:3000/api/admin/target-profiles/${targetProfile.id}/attach-organizations`;
    const response = await axios.post(requestUrl, body, config);
    expect(response.status).to.equal(204);
  });

  it('returns 403 when user is not Pix master', async () => {

    // user cannot get a pix-admin token if he has not pix master role
    const userData = { email: 'sco@example.net', password: 'Azerty123', scope: 'mon-pix' };

    databaseBuilder.factory.buildUser.withPassword(userData);
    const targetProfile = databaseBuilder.factory.buildTargetProfile();
    const organization = databaseBuilder.factory.buildOrganization();
    await databaseBuilder.commit();

    const accessToken = await createAccessToken({ email: userData.email, password: userData.password, scope: userData.scope });

    const body = { 'organization-ids': [organization.id] };

    const config = {
      headers: { Authorization: `Bearer ${accessToken}` },
    };

    const requestUrl = `http://localhost:3000/api/admin/target-profiles/${targetProfile.id}/attach-organizations`;

    let response;

    try {
      response = await axios.post(requestUrl, body, config);
    } catch (error) {
      response = error.response;
    }

    expect(response.status).to.equal(403);
  });

});
