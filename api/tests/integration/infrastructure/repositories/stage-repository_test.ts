// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, databaseBuilder, knex, catchErr } = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Stage'.
const Stage = require('../../../../lib/domain/models/Stage');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const stageRepository = require('../../../../lib/infrastructure/repositories/stage-repository');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'NotFoundEr... Remove this comment to see the full error message
const { NotFoundError } = require('../../../../lib/domain/errors');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Integration | Repository | StageRepository', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#findByCampaignId', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
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

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#findByTargetProfileId', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
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

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
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

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#create', function () {
    let targetProfileId: $TSFixMe;

    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(async function () {
      const targetProfile = databaseBuilder.factory.buildTargetProfile();

      await databaseBuilder.commit();

      targetProfileId = targetProfile.id;
    });

    // @ts-expect-error TS(2304): Cannot find name 'afterEach'.
    afterEach(function () {
      return knex('stages').delete();
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
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

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#updateStage', function () {
    let stageId: $TSFixMe;

    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
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

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
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

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
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

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should not update the stage when the id is unknown and throw an error', async function () {
      // when
      // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
      const error = await catchErr(stageRepository.updateStage)({
        id: 999999,
        prescriberTitle: 'palier bof',
      });

      // then
      expect(error).to.be.instanceOf(NotFoundError);
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#get', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
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

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should not find the stage when the id is unknown and throw an error', async function () {
      // given
      const { id: targetProfileId } = databaseBuilder.factory.buildTargetProfile();
      databaseBuilder.factory.buildStage({ targetProfileId });
      const unknownId = 999999999;
      await databaseBuilder.commit();

      // when
      // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
      const error = await catchErr(stageRepository.get)(unknownId);

      // then
      expect(error).to.be.instanceOf(NotFoundError);
    });
  });
});
