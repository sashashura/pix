import { describe, it } from 'mocha';
import { setupTest } from 'ember-mocha';
import sinon from 'sinon';

describe('Unit | Route | Assessments | Checkpoint', function () {
  setupTest();

  describe('#afterModel', function () {
    it('should force the progression reload when assessment is of competence evaluation', async function () {
      // given
      const route = this.owner.lookup('route:assessments/checkpoint');
      const reloadStub = sinon.stub();
      const assessment = {
        isCompetenceEvaluation: true,
        belongsTo: sinon.stub().returns({ reload: reloadStub }),
      };

      // when
      await route.afterModel(assessment);

      // then
      sinon.assert.calledWith(assessment.belongsTo, 'progression');
      sinon.assert.calledOnce(reloadStub);
    });

    it('should force the progression reload when assessment is for campaign', async function () {
      // given
      const route = this.owner.lookup('route:assessments/checkpoint');
      const storeStub = {
        queryRecord: sinon.stub(),
      };
      route.set('store', storeStub);
      const reloadStub = sinon.stub();
      const assessment = {
        isForCampaign: true,
        belongsTo: sinon.stub().returns({ reload: reloadStub }),
      };

      // when
      await route.afterModel(assessment);

      // then
      sinon.assert.calledWith(assessment.belongsTo, 'progression');
      sinon.assert.calledOnce(reloadStub);
    });
  });
});
