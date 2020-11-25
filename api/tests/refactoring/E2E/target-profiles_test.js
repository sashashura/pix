const chai = require('chai');
const expect = chai.expect;
const axios = require('axios');
const { knex } = require('../../../db/knex-database-connection');
const DatabaseBuilder = require('../../../db/database-builder/database-builder');
const encrypt = require('../../../lib/domain/services/encryption-service');
const { createAccessToken, generateAuthorizationHeader } = require('../tooling');

const databaseBuilder = new DatabaseBuilder({ knex });

describe('POST /{id}/attach-organizations', () => {

  afterEach(async function() {
    await databaseBuilder._emptyDatabase();
  });

  it('returns 204 when all everything is OK', async () => {

    const nonEncryptedPassword = 'Azerty123';
    // eslint-disable-next-line no-sync
    const userData = { email: 'sco@example.net', password: encrypt.hashPasswordSync(nonEncryptedPassword), scope: 'pix-admin' };

    const user = databaseBuilder.factory.buildUser.withPixRolePixMaster(userData);

    await databaseBuilder.commit();

    const config = {
      headers: { Authorization: generateAuthorizationHeader(user.id) },
    };

    const targetProfile = databaseBuilder.factory.buildTargetProfile();
    const organization = databaseBuilder.factory.buildOrganization();
    const body = { 'organization-ids': [organization.id] };
    await databaseBuilder.commit();

    const requestUrl = `http://localhost:3000/api/admin/target-profiles/${targetProfile.id}/attach-organizations`;
    const response = await axios.post(requestUrl, body, config);

    expect(response.status).to.equal(204);
  });

  it('returns 403 when user is not Pix master', async () => {

    const nonEncryptedPassword = 'Azerty123';
    // eslint-disable-next-line no-sync
    const userData = { email: 'sco@example.net', password: encrypt.hashPasswordSync(nonEncryptedPassword), scope: 'pix-admin' };

    const user = databaseBuilder.factory.buildUser(userData);

    await databaseBuilder.commit();

    const config = {
      headers: { Authorization: generateAuthorizationHeader(user.id) },
    };

    const targetProfile = databaseBuilder.factory.buildTargetProfile();
    const organization = databaseBuilder.factory.buildOrganization();
    const body = { 'organization-ids': [organization.id] };
    await databaseBuilder.commit();

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
