const {
  expect,
  HttpTestServer,
  sinon,
} = require('../../../test-helper');

const { NotFoundError } = require('../../../../lib/domain/errors');

const moduleUnderTest = require('../../../../lib/application/campaigns');

const campaignController = require('../../../../lib/application/campaigns/campaign-controller');

describe('Unit | Application | Router | campaign-router', () => {

  describe('POST /api/campaigns', () => {

    it('should return 201', async () => {
      // given
      sinon.stub(campaignController, 'save').callsFake((request, h) => h.response().created());
      const httpTestServer = new HttpTestServer();
      await httpTestServer.register(moduleUnderTest);

      // when
      const response = await httpTestServer.request('POST', '/api/campaigns');

      // then
      expect(response.statusCode).to.equal(201);
    });
  });

  describe('GET /api/campaigns', () => {

    it('should return 200', async () => {
      // given
      sinon.stub(campaignController, 'getByCode').returns('ok');
      const httpTestServer = new HttpTestServer();
      await httpTestServer.register(moduleUnderTest);

      // when
      const response = await httpTestServer.request('GET', '/api/campaigns?filter[code=SOMECODE]');

      // then
      expect(response.statusCode).to.equal(200);
    });

    it('should return 404 when controller throws a NotFound domain error', async () => {
      // given
      sinon.stub(campaignController, 'getByCode').rejects(new NotFoundError());
      const httpTestServer = new HttpTestServer();
      await httpTestServer.register(moduleUnderTest);

      // when
      const response = await httpTestServer.request('GET', '/api/campaigns?filter[code=SOMECODE]');

      // then
      expect(response.statusCode).to.equal(404);
    });
  });

  describe('GET /api/campaigns/{id}', () => {

    it('should return 200', async () => {
      // given
      sinon.stub(campaignController, 'getById').returns('ok');
      const httpTestServer = new HttpTestServer();
      await httpTestServer.register(moduleUnderTest);

      // when
      const response = await httpTestServer.request('GET', '/api/campaigns/1');

      // then
      expect(response.statusCode).to.equal(200);
    });

    it('should return 400 if campaign id is invalid', async () => {
      // given
      const httpTestServer = new HttpTestServer();
      await httpTestServer.register(moduleUnderTest);

      // when
      const response = await httpTestServer.request('GET', '/api/campaigns/invalid');

      // then
      expect(response.statusCode).to.equal(400);
    });
  });

  describe('GET /api/campaigns/{id}/csv-assessment-results', () => {

    it('should return 200', async () => {
      // given
      sinon.stub(campaignController, 'getCsvAssessmentResults').returns('ok');
      const httpTestServer = new HttpTestServer();
      await httpTestServer.register(moduleUnderTest);

      // when
      const response = await httpTestServer.request('GET', '/api/campaigns/1/csv-assessment-results');

      // then
      expect(response.statusCode).to.equal(200);
    });

    it('should return 400 with an invalid campaign id', async () => {
      // given
      const httpTestServer = new HttpTestServer();
      await httpTestServer.register(moduleUnderTest);

      // when
      const response = await httpTestServer.request('GET', '/api/campaigns/invalid/csv-assessment-results');

      // then
      expect(response.statusCode).to.equal(400);
    });
  });

  describe('GET /api/campaigns/{id}/csv-profiles-collection-results', () => {

    it('should return 200', async () => {
      // given
      sinon.stub(campaignController, 'getCsvProfilesCollectionResults').returns(200);
      const httpTestServer = new HttpTestServer();
      await httpTestServer.register(moduleUnderTest);

      // when
      const response = await httpTestServer.request('GET', '/api/campaigns/1/csv-profiles-collection-results');

      // then
      expect(response.statusCode).to.equal(200);
    });

    it('should return 400 with an invalid campaign id', async () => {
      // given
      const httpTestServer = new HttpTestServer();
      await httpTestServer.register(moduleUnderTest);

      // when
      const response = await httpTestServer.request('GET', '/api/campaigns/invalid/csv-profiles-collection-results');

      // then
      expect(response.statusCode).to.equal(400);
    });
  });

  describe('PATCH /api/campaigns/{id}', () => {

    it('should return 201', async () => {
      // given
      sinon.stub(campaignController, 'update').callsFake((request, h) => h.response('ok').created());
      const httpTestServer = new HttpTestServer();
      await httpTestServer.register(moduleUnderTest);

      // when
      const response = await httpTestServer.request('PATCH', '/api/campaigns/1');

      // then
      expect(response.statusCode).to.equal(201);
    });

    it('should return 400 with an invalid campaign id', async () => {
      // given
      const httpTestServer = new HttpTestServer();
      await httpTestServer.register(moduleUnderTest);

      // when
      const response = await httpTestServer.request('PATCH', '/api/campaigns/invalid');

      // then
      expect(response.statusCode).to.equal(400);
    });
  });

  describe('GET /api/campaigns/{id}/collective-results', () => {

    it('should return 200', async () => {
      // given
      sinon.stub(campaignController, 'getCollectiveResult').returns('ok');
      const httpTestServer = new HttpTestServer();
      await httpTestServer.register(moduleUnderTest);

      // when
      const response = await httpTestServer.request('GET', '/api/campaigns/1/collective-results');

      // then
      expect(response.statusCode).to.equal(200);
    });

    it('should return 400 with an invalid campaign id', async () => {
      // given
      const httpTestServer = new HttpTestServer();
      await httpTestServer.register(moduleUnderTest);

      // when
      const response = await httpTestServer.request('GET', '/api/campaigns/invalid/collective-results');

      // then
      expect(response.statusCode).to.equal(400);
    });
  });

  describe('GET /api/campaigns/{id}/analyses', () => {

    it('should return 200', async () => {
      // given
      sinon.stub(campaignController, 'getAnalysis').returns('ok');
      const httpTestServer = new HttpTestServer();
      await httpTestServer.register(moduleUnderTest);

      // when
      const response = await httpTestServer.request('GET', '/api/campaigns/1/analyses');

      // then
      expect(response.statusCode).to.equal(200);
    });

    it('should return 400', async () => {
      // given
      const httpTestServer = new HttpTestServer();
      await httpTestServer.register(moduleUnderTest);

      // when
      const response = await httpTestServer.request('GET', '/api/campaigns/wrong_id/analyses');

      // then
      expect(response.statusCode).to.equal(400);
    });
  });

  describe('PUT /api/campaigns/{id}/archive', () => {

    it('should return 200', async () => {
      // given
      sinon.stub(campaignController, 'archiveCampaign').returns('ok');
      const httpTestServer = new HttpTestServer();
      await httpTestServer.register(moduleUnderTest);

      // when
      const response = await httpTestServer.request('PUT', '/api/campaigns/1/archive');

      // then
      expect(response.statusCode).to.equal(200);
    });

    it('should return 400 with an invalid campaign id', async () => {
      // given
      const httpTestServer = new HttpTestServer();
      await httpTestServer.register(moduleUnderTest);

      // when
      const response = await httpTestServer.request('PUT', '/api/campaigns/invalid/archive');

      // then
      expect(response.statusCode).to.equal(400);
    });
  });

  describe('DELETE /api/campaigns/{id}/archive', () => {

    it('should return 200', async () => {
      // given
      sinon.stub(campaignController, 'unarchiveCampaign').returns('ok');
      const httpTestServer = new HttpTestServer();
      await httpTestServer.register(moduleUnderTest);

      // when
      const response = await httpTestServer.request('DELETE', '/api/campaigns/1/archive');

      // then
      expect(response.statusCode).to.equal(200);
    });

    it('should return 400 with an invalid campaign id', async () => {
      // given
      const httpTestServer = new HttpTestServer();
      await httpTestServer.register(moduleUnderTest);

      // when
      const response = await httpTestServer.request('DELETE', '/api/campaigns/invalid/archive');

      // then
      expect(response.statusCode).to.equal(400);
    });
  });

  describe('GET /api/campaigns/{id}/profiles-collection-participations', () => {

    context('success cases', () => {

      let httpTestServer;

      beforeEach(async () => {
        // given
        sinon.stub(campaignController, 'findProfilesCollectionParticipations').returns('ok');
        httpTestServer = new HttpTestServer();
        await httpTestServer.register(moduleUnderTest);
      });

      it('should return 200 with empty query string', async () => {
        // when
        const result = await httpTestServer.request('GET', '/api/campaigns/1/profiles-collection-participations');

        // then
        expect(result.statusCode).to.equal(200);
      });

      it('should return 200 with pagination', async () => {
        // when
        const result = await httpTestServer.request('GET', '/api/campaigns/1/profiles-collection-participations?page[number]=1&page[size]=25');

        // then
        expect(result.statusCode).to.equal(200);
      });

      it('should return 200 with a string array of one element as division filter', async () => {
        // when
        const result = await httpTestServer.request('GET', '/api/campaigns/1/profiles-collection-participations?filter[divisions][]="3EMEB"');

        // then
        expect(result.statusCode).to.equal(200);
      });

      it('should return 200 with a string array of several elements as division filter', async () => {
        // when
        const result = await httpTestServer.request('GET', '/api/campaigns/1/profiles-collection-participations?filter[divisions][]="3EMEB"&filter[divisions][]="3EMEA"');

        // then
        expect(result.statusCode).to.equal(200);
      });
    });

    context('error cases', () => {

      let httpTestServer;

      beforeEach(async () => {
        // given
        httpTestServer = new HttpTestServer();
        await httpTestServer.register(moduleUnderTest);
      });

      it('should return 400 with unexpected filters', async () => {
        // when
        const result = await httpTestServer.request('GET', '/api/campaigns/1/profiles-collection-participations?filter[unexpected][]=5');

        // then
        expect(result.statusCode).to.equal(400);
      });

      it('should return 400 with a division filter which is not an array', async () => {
        // when
        const result = await httpTestServer.request('GET', '/api/campaigns/1/profiles-collection-participations?filter[divisions]="3EMEA"');

        // then
        expect(result.statusCode).to.equal(400);
      });

      it('should return 400 with a page number which is not a number', async () => {
        // when
        const result = await httpTestServer.request('GET', '/api/campaigns/1/profiles-collection-participations?page[number]=a');

        // then
        expect(result.statusCode).to.equal(400);
      });

      it('should return 400 with a page size which is not a number', async () => {
        // when
        const result = await httpTestServer.request('GET', '/api/campaigns/1/profiles-collection-participations?page[size]=a');

        // then
        expect(result.statusCode).to.equal(400);
      });

      it('should return 400 with an invalid campaign id', async () => {
        // when
        const result = await httpTestServer.request('GET', '/api/campaigns/invalid/profiles-collection-participations');

        // then
        expect(result.statusCode).to.equal(400);
      });
    });
  });

  describe('GET /api/campaigns/{id}/assessment-participations', () => {

    context('success cases', () => {

      let httpTestServer;

      beforeEach(async () => {
        // given
        sinon.stub(campaignController, 'findAssessmentParticipations').returns('ok');
        httpTestServer = new HttpTestServer();
        await httpTestServer.register(moduleUnderTest);
      });

      it('should return 200 with empty query string', async () => {
        // when
        const result = await httpTestServer.request('GET', '/api/campaigns/1/assessment-participations');

        // then
        expect(result.statusCode).to.equal(200);
      });

      it('should return 200 with pagination', async () => {
        // when
        const result = await httpTestServer.request('GET', '/api/campaigns/1/assessment-participations?page[number]=1&page[size]=25');

        // then
        expect(result.statusCode).to.equal(200);
      });

      it('should return 200 with a string array of one element as division filter', async () => {
        // when
        const result = await httpTestServer.request('GET', '/api/campaigns/1/assessment-participations?filter[divisions][]="3EMEB"');

        // then
        expect(result.statusCode).to.equal(200);
      });

      it('should return 200 with a string array of several elements as division filter', async () => {
        // when
        const result = await httpTestServer.request('GET', '/api/campaigns/1/assessment-participations?filter[divisions][]="3EMEB"&filter[divisions][]="3EMEA"');

        // then
        expect(result.statusCode).to.equal(200);
      });

      it('should return 200 with a string array of one element as badge filter', async () => {
        // when
        const result = await httpTestServer.request('GET', '/api/campaigns/1/assessment-participations?filter[badges][]=114');

        // then
        expect(result.statusCode).to.equal(200);
      });

      it('should return 200 with a string array of several elements as badge filter', async () => {
        // when
        const result = await httpTestServer.request('GET', '/api/campaigns/1/assessment-participations?filter[badges][]=114&filter[badges][]=115');

        // then
        expect(result.statusCode).to.equal(200);
      });

      it('should return 200 with a string array of one element as stage filter', async () => {
        // when
        const result = await httpTestServer.request('GET', '/api/campaigns/1/assessment-participations?filter[stages][]=114');

        // then
        expect(result.statusCode).to.equal(200);
      });

      it('should return 200 with a string array of several elements as stage filter', async () => {
        // when
        const result = await httpTestServer.request('GET', '/api/campaigns/1/assessment-participations?filter[stages][]=114&filter[stages][]=115');

        // then
        expect(result.statusCode).to.equal(200);
      });
    });

    context('error cases', () => {

      let httpTestServer;

      beforeEach(async () => {
        // given
        httpTestServer = new HttpTestServer();
        await httpTestServer.register(moduleUnderTest);
      });

      it('should return 400 with unexpected filters', async () => {
        // when
        const result = await httpTestServer.request('GET', '/api/campaigns/1/assessment-participations?filter[unexpected][]=5');

        // then
        expect(result.statusCode).to.equal(400);
      });

      it('should return 400 with a division filter which is not an array', async () => {
        // when
        const result = await httpTestServer.request('GET', '/api/campaigns/1/assessment-participations?filter[divisions]="3EMEA"');

        // then
        expect(result.statusCode).to.equal(400);
      });

      it('should return 400 with a badge filter which is not an array', async () => {
        // when
        const result = await httpTestServer.request('GET', '/api/campaigns/1/assessment-participations?filter[badges]=114');

        // then
        expect(result.statusCode).to.equal(400);
      });

      it('should return 400 with a badge filter which is not a number', async () => {
        // when
        const result = await httpTestServer.request('GET', '/api/campaigns/1/assessment-participations?filter[badges][]="truc"');

        // then
        expect(result.statusCode).to.equal(400);
      });

      it('should return 400 with a stage filter which is not an array', async () => {
        // when
        const result = await httpTestServer.request('GET', '/api/campaigns/1/assessment-participations?filter[stages]=114');

        // then
        expect(result.statusCode).to.equal(400);
      });

      it('should return 400 with a stage filter which is not a number', async () => {
        // when
        const result = await httpTestServer.request('GET', '/api/campaigns/1/assessment-participations?filter[stages][]="truc"');

        // then
        expect(result.statusCode).to.equal(400);
      });

      it('should return 400 with a page number which is not a number', async () => {
        // when
        const result = await httpTestServer.request('GET', '/api/campaigns/1/assessment-participations?page[number]=a');

        // then
        expect(result.statusCode).to.equal(400);
      });

      it('should return 400 with a page size which is not a number', async () => {
        // when
        const result = await httpTestServer.request('GET', '/api/campaigns/1/assessment-participations?page[size]=a');

        // then
        expect(result.statusCode).to.equal(400);
      });

      it('should return 400 with an invalid campaign id', async () => {
        // when
        const result = await httpTestServer.request('GET', '/api/campaigns/invalid/assessment-participations');

        // then
        expect(result.statusCode).to.equal(400);
      });
    });
  });

  describe('GET /api/campaigns/{id}/divisions', () => {

    it('should return 200', async () => {
      // given
      sinon.stub(campaignController, 'division').returns('ok');
      const httpTestServer = new HttpTestServer();
      await httpTestServer.register(moduleUnderTest);

      // when
      const result = await httpTestServer.request('GET', '/api/campaigns/1/divisions');

      // then
      expect(result.statusCode).to.equal(200);
    });

    it('should return 400 with an invalid campaign id', async () => {
      // given
      const httpTestServer = new HttpTestServer();
      await httpTestServer.register(moduleUnderTest);

      // when
      const result = await httpTestServer.request('GET', '/api/campaigns/invalid/divisions');

      // then
      expect(result.statusCode).to.equal(400);
    });
  });
});
