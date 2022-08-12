// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, sinon, nock } = require('../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'script'.
const script = require('../../../scripts/update-sco-organizations-with-province-code-and-external-id');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Acceptance | Scripts | update-sco-organizations-with-province-code-and-external-id.js', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#assertFileValidity', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should throw an error when file does not exist', async function () {
      // given
      const filePath = 'inexistant.file';

      try {
        // when
        await script.assertFileValidity(filePath);

        // then
        expect.fail('Expected error to have been thrown');
      } catch (err) {
        expect((err as $TSFixMe).message).to.equal('File not found inexistant.file');
      }
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should throw an error when file extension is not ".csv"', async function () {
      // given
      // @ts-expect-error TS(2304): Cannot find name '__dirname'.
      const filePath = `${__dirname}/file_with_bad_extension.html`;

      try {
        // when
        await script.assertFileValidity(filePath);

        // then
        expect.fail('Expected error to have been thrown');
      } catch (err) {
        expect((err as $TSFixMe).message).to.equal('File extension not supported .html');
      }
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return true if file is valid', async function () {
      // given
      // @ts-expect-error TS(2304): Cannot find name '__dirname'.
      const filePath = `${__dirname}/valid-organizations-test-file.csv`;

      // when
      const result = await script.assertFileValidity(filePath);

      // then
      expect(result).to.be.true;
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#convertCSVDataIntoOrganizations', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return an array of organizations (JSON) object', function () {
      // given
      const csvParsingResult = {
        data: [
          {
            Orga_ID: '1',
            'Code établissement (code UAI)': '',
          },
          {
            Orga_ID: '2',
            'Code établissement (code UAI)': '9752145V',
          },
          {
            Orga_ID: '3',
            'Code établissement (code UAI)': '01A4556S',
          },
        ],
      };
      const expectedOrganizations = [
        {
          id: 1,
          externalId: '',
          provinceCode: '',
        },
        {
          id: 2,
          externalId: '9752145V',
          provinceCode: '975',
        },
        {
          id: 3,
          externalId: '01A4556S',
          provinceCode: '01A',
        },
      ];

      // when
      const organizations = script.convertCSVDataIntoOrganizations(csvParsingResult);

      // then
      expect(organizations).to.deep.equal(expectedOrganizations);
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#saveOrganizations', function () {
    let options: $TSFixMe;

    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(function () {
      // @ts-expect-error TS(2580): Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
      process.env.BASE_URL = 'http://localhost:3000';
      options = {
        accessToken: 'token-token',
        organizations: [],
      };
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should not do any http request, when there is no organization', function () {
      // given
      options.organizations = [];

      // when
      const promise = script.saveOrganizations(options);

      // then
      promise.catch(() => {
        sinon.assert.fail('Should not fail');
      });
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should call PATCH /api/organizations/:id once, when there is an organization', async function () {
      // given
      const expectedBody = {
        data: {
          type: 'organizations',
          id: 1,
          attributes: {
            'external-id': '9752145V',
            'province-code': '975',
          },
        },
      };

      options.organizations = [
        {
          id: 1,
          externalId: '9752145V',
          provinceCode: '975',
        },
      ];

      const nockStub = nock('http://localhost:3000', {
        reqheaders: { authorization: 'Bearer token-token' },
      })
        .patch('/api/organizations/1', function (body: $TSFixMe) {
          return JSON.stringify(body) === JSON.stringify(expectedBody);
        })
        .reply(200, {});

      // when
      await script.saveOrganizations(options);

      // then
      expect(nockStub.isDone()).to.equal(true);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should call PATCH /api/organizations/:id three times, when there are three organizations', async function () {
      // given
      const expectedBody1 = {
        data: {
          type: 'organizations',
          id: 1,
          attributes: {
            'external-id': '9752145V',
            'province-code': '975',
          },
        },
      };
      const expectedBody2 = {
        data: {
          type: 'organizations',
          id: 2,
          attributes: {
            'external-id': '',
            'province-code': '',
          },
        },
      };
      const expectedBody3 = {
        data: {
          type: 'organizations',
          id: 3,
          attributes: {
            'external-id': '02A2145V',
            'province-code': '02A',
          },
        },
      };

      options.organizations = [
        {
          id: 1,
          externalId: '9752145V',
          provinceCode: '975',
        },
        {
          id: 2,
          externalId: '',
          provinceCode: '',
        },
        {
          id: 3,
          externalId: '02A2145V',
          provinceCode: '02A',
        },
      ];

      const nockStub1 = nock('http://localhost:3000', {
        reqheaders: { authorization: 'Bearer token-token' },
      })
        .patch('/api/organizations/1', function (body: $TSFixMe) {
          return JSON.stringify(body) === JSON.stringify(expectedBody1);
        })
        .reply(200, {});
      const nockStub2 = nock('http://localhost:3000', {
        reqheaders: { authorization: 'Bearer token-token' },
      })
        .patch('/api/organizations/2', function (body: $TSFixMe) {
          return JSON.stringify(body) === JSON.stringify(expectedBody2);
        })
        .reply(200, {});
      const nockStub3 = nock('http://localhost:3000', {
        reqheaders: { authorization: 'Bearer token-token' },
      })
        .patch('/api/organizations/3', function (body: $TSFixMe) {
          return JSON.stringify(body) === JSON.stringify(expectedBody3);
        })
        .reply(200, {});

      // when
      await script.saveOrganizations(options);

      // then
      expect(nockStub1.isDone()).to.equal(true);
      expect(nockStub2.isDone()).to.equal(true);
      expect(nockStub3.isDone()).to.equal(true);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should call PATCH /api/organizations/:id three times, even when an error occur on an organization', async function () {
      // given
      const expectedBody1 = {
        data: {
          type: 'organizations',
          id: 1,
          attributes: {
            'external-id': '9752145V',
            'province-code': '975',
          },
        },
      };
      const expectedBody2 = {
        data: {
          type: 'organizations',
          id: 2,
          attributes: {
            'external-id': '',
            'province-code': '',
          },
        },
      };
      const expectedBody3 = {
        data: {
          type: 'organizations',
          id: 3,
          attributes: {
            'external-id': '02A2145V',
            'province-code': '02A',
          },
        },
      };

      options.organizations = [
        {
          id: 1,
          externalId: '9752145V',
          provinceCode: '975',
        },
        {
          id: 2,
          externalId: '',
          provinceCode: '',
        },
        {
          id: 3,
          externalId: '02A2145V',
          provinceCode: '02A',
        },
      ];

      const nockStub1 = nock('http://localhost:3000', {
        reqheaders: { authorization: 'Bearer token-token' },
      })
        .patch('/api/organizations/1', function (body: $TSFixMe) {
          return JSON.stringify(body) === JSON.stringify(expectedBody1);
        })
        .replyWithError('Error');

      const nockStub2 = nock('http://localhost:3000', {
        reqheaders: { authorization: 'Bearer token-token' },
      })
        .patch('/api/organizations/2', function (body: $TSFixMe) {
          return JSON.stringify(body) === JSON.stringify(expectedBody2);
        })
        .reply(200, {});

      const nockStub3 = nock('http://localhost:3000', {
        reqheaders: { authorization: 'Bearer token-token' },
      })
        .patch('/api/organizations/3', function (body: $TSFixMe) {
          return JSON.stringify(body) === JSON.stringify(expectedBody3);
        })
        .reply(200, {});

      // when
      await script.saveOrganizations(options);

      // then
      expect(nockStub1.isDone()).to.equal(true);
      expect(nockStub2.isDone()).to.equal(true);
      expect(nockStub3.isDone()).to.equal(true);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it(
      'should return a promise resolving to an array of objects ' +
        'containing the API error and relevant informations to find the csv row',
      async function () {
        // given
        const expectedBody1 = {
          data: {
            type: 'organizations',
            id: 1,
            attributes: {
              'external-id': '9752145V',
              'province-code': '975',
            },
          },
        };
        const expectedBody2 = {
          data: {
            type: 'organizations',
            id: 2,
            attributes: {
              'external-id': '',
              'province-code': '',
            },
          },
        };
        const expectedBody3 = {
          data: {
            type: 'organizations',
            id: 3,
            attributes: {
              'external-id': '02A2145V',
              'province-code': '02A',
            },
          },
        };
        const expectedErrorObjects = [
          {
            errorMessage: 'Error: Error 1',
            organization: {
              id: 1,
              externalId: '9752145V',
              provinceCode: '975',
            },
          },
          {
            errorMessage: 'Error: Error 2',
            organization: {
              id: 2,
              externalId: '',
              provinceCode: '',
            },
          },
        ];

        options.organizations = [
          {
            id: 1,
            externalId: '9752145V',
            provinceCode: '975',
          },
          {
            id: 2,
            externalId: '',
            provinceCode: '',
          },
          {
            id: 3,
            externalId: '02A2145V',
            provinceCode: '02A',
          },
        ];

        nock('http://localhost:3000', {
          reqheaders: { authorization: 'Bearer token-token' },
        })
          .patch('/api/organizations/1', function (body: $TSFixMe) {
            return JSON.stringify(body) === JSON.stringify(expectedBody1);
          })
          .replyWithError('Error 1');

        nock('http://localhost:3000', {
          reqheaders: { authorization: 'Bearer token-token' },
        })
          .patch('/api/organizations/2', function (body: $TSFixMe) {
            return JSON.stringify(body) === JSON.stringify(expectedBody2);
          })
          .replyWithError('Error 2');

        nock('http://localhost:3000', {
          reqheaders: { authorization: 'Bearer token-token' },
        })
          .patch('/api/organizations/3', function (body: $TSFixMe) {
            return JSON.stringify(body) === JSON.stringify(expectedBody3);
          })
          .reply(200, {});

        // when
        const errorObjects = await script.saveOrganizations(options);

        // then
        expect(errorObjects).to.deep.equal(expectedErrorObjects);
      }
    );
  });
});
