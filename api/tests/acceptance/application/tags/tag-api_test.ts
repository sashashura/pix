const {
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
  expect,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'generateVa... Remove this comment to see the full error message
  generateValidRequestAuthorizationHeader,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'insertUser... Remove this comment to see the full error message
  insertUserWithRoleSuperAdmin,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'databaseBu... Remove this comment to see the full error message
  databaseBuilder,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'knex'.
  knex,
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
} = require('../../../test-helper');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'createServ... Remove this comment to see the full error message
const createServer = require('../../../../server');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Acceptance | Route | tag-router', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('POST /api/admin/tags', function () {
    // @ts-expect-error TS(2304): Cannot find name 'afterEach'.
    afterEach(async function () {
      await knex('tags').delete();
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return the created tag with 201 HTTP status code', async function () {
      // given
      const tagName = 'SUPER TAG';
      const server = await createServer();
      await databaseBuilder.commit();

      const userId = (await insertUserWithRoleSuperAdmin()).id;

      // when
      const response = await server.inject({
        method: 'POST',
        url: '/api/admin/tags',
        payload: {
          data: {
            type: 'tags',
            attributes: {
              name: tagName,
            },
          },
        },
        headers: { authorization: generateValidRequestAuthorizationHeader(userId) },
      });

      // then
      expect(response.statusCode).to.equal(201);
      expect(response.result.data.type).to.deep.equal('tags');
      expect(response.result.data.attributes.name).to.deep.equal(tagName);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return 403 HTTP status code when the user authenticated is not SuperAdmin', async function () {
      // given
      const server = await createServer();
      const userId = databaseBuilder.factory.buildUser().id;
      await databaseBuilder.commit();

      const tagName = 'un super tag';

      // when
      const response = await server.inject({
        method: 'POST',
        url: '/api/admin/tags',
        payload: {
          data: {
            type: 'tags',
            attributes: {
              name: tagName,
            },
          },
        },
        headers: { authorization: generateValidRequestAuthorizationHeader(userId) },
      });

      // then
      expect(response.statusCode).to.equal(403);
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('GET /api/admin/tags', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return a list of tags with 200 HTTP status code', async function () {
      // given
      const server = await createServer();
      const tag1 = databaseBuilder.factory.buildTag({ name: 'TAG1' });
      const tag2 = databaseBuilder.factory.buildTag({ name: 'TAG2' });
      await databaseBuilder.commit();

      const userId = (await insertUserWithRoleSuperAdmin()).id;

      const options = {
        method: 'GET',
        url: '/api/admin/tags',
        headers: { authorization: generateValidRequestAuthorizationHeader(userId) },
      };

      const expectedTags = [
        {
          attributes: {
            name: tag1.name,
          },
          id: tag1.id.toString(),
          type: 'tags',
        },
        {
          attributes: {
            name: tag2.name,
          },
          id: tag2.id.toString(),
          type: 'tags',
        },
      ];

      // when
      const response = await server.inject(options);

      // then
      expect(response.statusCode).to.equal(200);
      expect(response.result.data).to.deep.equal(expectedTags);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return 403 HTTP status code when the user authenticated is not SuperAdmin', async function () {
      // given
      const server = await createServer();
      const userId = databaseBuilder.factory.buildUser().id;
      await databaseBuilder.commit();

      const options = {
        method: 'GET',
        url: '/api/admin/tags',
        headers: { authorization: generateValidRequestAuthorizationHeader(userId) },
      };

      // when
      const response = await server.inject(options);

      // then
      expect(response.statusCode).to.equal(403);
    });
  });
});
