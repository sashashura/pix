const { expect, databaseBuilder, knex, catchErr } = require('../../../test-helper');
const Stage = require('../../../../lib/domain/models/Stage');
const stageRepository = require('../../../../lib/infrastructure/repositories/stage-repository');
const _ = require('lodash');
const { NotFoundError } = require('../../../../lib/domain/errors');

describe('Integration | Repository | StageRepository', function () {
  describe('#findByCampaignId', function () {
    it('should retrieve stage given campaignId', async function () {
      // given
      const targetProfile = databaseBuilder.factory.buildTargetProfile();
      const campaign = databaseBuilder.factory.buildCampaign();

      databaseBuilder.factory.buildStage({ targetProfileId: campaign.targetProfileId, threshold: 24 });
      databaseBuilder.factory.buildStage({ targetProfileId: campaign.targetProfileId, threshold: 55 });

      databaseBuilder.factory.buildStage({ targetProfileId: targetProfile.id });

      await databaseBuilder.commit();

      // when
      const stages = await stageRepository.findByCampaignId(campaign.id);

      // then
      expect(stages.length).to.equal(2);

      expect(stages[0].threshold).to.equal(24);
      expect(stages[1].threshold).to.equal(55);
    });
  });

  describe('#findByTargetProfileId', function () {
    it('should retrieve stage given targetProfileId', async function () {
      // given
      const targetProfile = databaseBuilder.factory.buildTargetProfile();
      const anotherTargetProfile = databaseBuilder.factory.buildTargetProfile();

      databaseBuilder.factory.buildStage({ targetProfileId: targetProfile.id, threshold: 24 });
      databaseBuilder.factory.buildStage({ targetProfileId: anotherTargetProfile.id, threshold: 56 });

      await databaseBuilder.commit();

      // when
      const stages = await stageRepository.findByTargetProfileId(targetProfile.id);

      // then
      expect(stages.length).to.equal(1);
    });

    it('should retrieve stages sorted by threshold', async function () {
      // given
      const targetProfile = databaseBuilder.factory.buildTargetProfile();

      databaseBuilder.factory.buildStage({ targetProfileId: targetProfile.id, threshold: 24 });
      databaseBuilder.factory.buildStage({ targetProfileId: targetProfile.id, threshold: 0 });

      await databaseBuilder.commit();

      // when
      const stages = await stageRepository.findByTargetProfileId(targetProfile.id);

      // then
      expect(stages.length).to.equal(2);
      expect(stages[0].threshold).to.equal(0);
    });
  });

  describe('#create', function () {
    let targetProfileId;

    beforeEach(async function () {
      const targetProfile = databaseBuilder.factory.buildTargetProfile();

      await databaseBuilder.commit();

      targetProfileId = targetProfile.id;
    });

    afterEach(function () {
      return knex('stages').delete();
    });

    it('create a stage on a target profile', async function () {
      // given
      const stageToSave = {
        title: 'My title',
        message: 'My message',
        threshold: 42,
        targetProfileId,
      };

      // when
      const savedStage = await stageRepository.create(stageToSave);

      // then
      expect(savedStage).to.be.instanceof(Stage);
      expect(savedStage.id).to.exist;
      expect(savedStage).to.deep.include(_.pick(stageToSave, ['title', 'message', 'threshold']));
    });
  });

  describe('#updateStage', function () {
    let stageId;

    beforeEach(async function () {
      const { id: targetProfileId } = databaseBuilder.factory.buildTargetProfile();

      stageId = databaseBuilder.factory.buildStage({
        targetProfileId,
        title: "titre d'origine",
        message: "message d'origine",
        threshold: 50,
        prescriberTitle: "titre d'origine",
        prescriberDescription: "description d'origine",
      }).id;

      await databaseBuilder.commit();
    });

    it('should update the stage with new data', async function () {
      // when
      await stageRepository.updateStage({
        id: stageId,
        title: "c'est cool",
        message: "ça va aller t'inquiète pas",
        threshold: 60,
        prescriberTitle: 'palier bof',
        prescriberDescription: 'tu es moyen',
      });

      // then
      const actualStage = await knex('stages').select().where({ id: stageId }).first();
      expect(actualStage).to.contain({
        title: "c'est cool",
        message: "ça va aller t'inquiète pas",
        threshold: 60,
        prescriberTitle: 'palier bof',
        prescriberDescription: 'tu es moyen',
      });
    });

    it('should update only one attribute', async function () {
      // when
      await stageRepository.updateStage({ id: stageId, prescriberTitle: 'palier bof' });

      // then
      const actualStage = await knex('stages').select().where({ id: stageId }).first();
      expect(actualStage).to.contain({
        title: "titre d'origine",
        message: "message d'origine",
        threshold: 50,
        prescriberTitle: 'palier bof',
        prescriberDescription: "description d'origine",
      });
    });

    it('should not update the stage when the id is unknown and throw an error', async function () {
      // given
      const id = 999999;

      // when
      const error = await catchErr(stageRepository.updateStage)({
        id,
        prescriberTitle: 'palier bof',
      });

      // then
      expect(error).to.be.instanceOf(NotFoundError);
      expect(error.message).to.equal(`Le palier avec l'id ${id} n'existe pas`);
    });
  });

  describe('#get', function () {
    it('should get stage', async function () {
      // given
      const { id: targetProfileId } = databaseBuilder.factory.buildTargetProfile();
      databaseBuilder.factory.buildStage({ targetProfileId });
      databaseBuilder.factory.buildStage({ targetProfileId });
      databaseBuilder.factory.buildStage({ targetProfileId });
      const stage = databaseBuilder.factory.buildStage({ targetProfileId, id: 123456 });

      await databaseBuilder.commit();

      // when
      const expectedStage = await stageRepository.get(stage.id);

      // then
      expect(expectedStage.id).to.equal(stage.id);
      expect(expectedStage.message).to.equal(stage.message);
      expect(expectedStage.title).to.equal(stage.title);
    });

    it('should not find the stage when the id is unknown and throw an error', async function () {
      // given
      const { id: targetProfileId } = databaseBuilder.factory.buildTargetProfile();
      databaseBuilder.factory.buildStage({ targetProfileId });
      const unknownId = 999999999;
      await databaseBuilder.commit();

      // when
      const error = await catchErr(stageRepository.get)(unknownId);

      // then
      expect(error).to.be.instanceOf(NotFoundError);
      expect(error.message).to.equal(`Not found stage for ID ${unknownId}`);
    });
  });
});
