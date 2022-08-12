// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, databaseBuilder, mockLearningContent, knex, catchErr, sinon } = require('../../../test-helper');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'badgeRepos... Remove this comment to see the full error message
const badgeRepository = require('../../../../lib/infrastructure/repositories/badge-repository');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'badgeCrite... Remove this comment to see the full error message
const badgeCriteriaRepository = require('../../../../lib/infrastructure/repositories/badge-criteria-repository');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'skillSetRe... Remove this comment to see the full error message
const skillSetRepository = require('../../../../lib/infrastructure/repositories/skill-set-repository');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'targetProf... Remove this comment to see the full error message
const targetProfileRepository = require('../../../../lib/infrastructure/repositories/target-profile-repository');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const createBadge = require('../../../../lib/domain/usecases/create-badge');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Badge'.
const Badge = require('../../../../lib/domain/models/Badge');
const {
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'AlreadyExi... Remove this comment to see the full error message
  AlreadyExistingEntityError,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'NotFoundEr... Remove this comment to see the full error message
  NotFoundError,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'InvalidSki... Remove this comment to see the full error message
  InvalidSkillSetError,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'MissingBad... Remove this comment to see the full error message
  MissingBadgeCriterionError,
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
} = require('../../../../lib/domain/errors');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Integration | UseCases | create-badge', function () {
  let targetProfileId: $TSFixMe;
  let badge: $TSFixMe;
  let badgeCreation: $TSFixMe;
  let existingBadgeKey: $TSFixMe;
  let dependencies: $TSFixMe;

  // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
  beforeEach(async function () {
    const learningContent = {
      skills: [{ id: 'recSkill1' }],
    };

    mockLearningContent(learningContent);

    targetProfileId = databaseBuilder.factory.buildTargetProfile().id;
    learningContent.skills.forEach((skill) =>
      databaseBuilder.factory.buildTargetProfileSkill({ targetProfileId, skillId: skill.id })
    );
    existingBadgeKey = databaseBuilder.factory.buildBadge().key;

    await databaseBuilder.commit();

    badge = {
      key: 'TOTO23',
      altMessage: 'example image',
      imageUrl: 'https//images.example.net',
      message: 'Bravo !',
      title: 'Le super badge',
      isCertifiable: false,
      isAlwaysVisible: true,
    };

    badgeCreation = {
      ...badge,
    };

    dependencies = {
      badgeRepository,
      badgeCriteriaRepository,
      targetProfileRepository,
      skillSetRepository,
    };
  });

  // @ts-expect-error TS(2304): Cannot find name 'afterEach'.
  afterEach(async function () {
    await knex('skill-sets').delete();
    await knex('badge-criteria').delete();
    await knex('badges').delete();
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('should not save a new badge if there are no associated criteria', async function () {
    // when
    // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
    const error = await catchErr(createBadge)({
      targetProfileId,
      badgeCreation,
      ...dependencies,
    });

    // then
    expect(error).to.be.an.instanceOf(MissingBadgeCriterionError);
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('should save a new badge with a campaign criterion', async function () {
    // given
    badgeCreation.campaignThreshold = 99;

    // when
    const result = await createBadge({
      targetProfileId,
      badgeCreation,
      ...dependencies,
    });

    // then
    expect(result).to.be.an.instanceOf(Badge);
    expect(_.pick(result, Object.keys(badge))).to.deep.equal(badge);

    const criteria = await knex('badge-criteria').select().where({ badgeId: result.id });
    expect(criteria).to.have.lengthOf(1);
    expect(_.pick(criteria[0], ['threshold', 'scope'])).to.deep.equal({
      threshold: badgeCreation.campaignThreshold,
      scope: 'CampaignParticipation',
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('should save a new badge even if the threshold is 0', async function () {
    // given
    badgeCreation.campaignThreshold = 0;

    // when
    const result = await createBadge({
      targetProfileId,
      badgeCreation,
      ...dependencies,
    });

    // then
    expect(result).to.be.an.instanceOf(Badge);
    expect(_.pick(result, Object.keys(badge))).to.deep.equal(badge);

    const criteria = await knex('badge-criteria').select().where({ badgeId: result.id });
    expect(criteria).to.have.lengthOf(1);
    expect(_.pick(criteria[0], ['threshold', 'scope'])).to.deep.equal({
      threshold: badgeCreation.campaignThreshold,
      scope: 'CampaignParticipation',
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('should save a new badge with a skillset criterion', async function () {
    // given
    Object.assign(badgeCreation, {
      skillSetThreshold: 99,
      skillSetName: 'skillset-name',
      skillSetSkillsIds: ['recSkill1'],
    });

    // when
    const result = await createBadge({
      targetProfileId,
      badgeCreation,
      ...dependencies,
    });

    // then
    expect(result).to.be.an.instanceOf(Badge);
    expect(_.pick(result, Object.keys(badge))).to.deep.equal(badge);

    const skillSets = await knex('skill-sets').select().where({ badgeId: result.id });
    expect(skillSets).to.have.lengthOf(1);
    expect(_.pick(skillSets[0], ['name', 'skillIds'])).to.deep.equal({
      name: badgeCreation.skillSetName,
      skillIds: badgeCreation.skillSetSkillsIds,
    });

    const criteria = await knex('badge-criteria').select().where({ badgeId: result.id });
    expect(criteria).to.have.lengthOf(1);
    expect(_.pick(criteria[0], ['threshold', 'scope', 'skillSetIds'])).to.deep.equal({
      threshold: badgeCreation.skillSetThreshold,
      scope: 'SkillSet',
      skillSetIds: [skillSets[0].id],
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('when an error occurs during criterion creation', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should not create a badge nor a criterion', async function () {
      // given
      badgeCreation.campaignThreshold = 99;
      const expectedError = new Error('Erreur lors de la création du critère');
      dependencies.badgeCriteriaRepository = {
        save: sinon.stub().rejects(expectedError),
      };

      // when
      // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
      const error = await catchErr(createBadge)({
        targetProfileId,
        badgeCreation,
        ...dependencies,
      });

      // then
      expect(error).to.equal(expectedError);
      const badges = await knex('badges').select().where({ key: badgeCreation.key });
      expect(badges).to.have.lengthOf(0);
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe("when targetProfile doesn't exist", function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should throw a NotFoundError', async function () {
      // when
      // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
      const error = await catchErr(createBadge)({
        targetProfileId: -1,
        badgeCreation,
        ...dependencies,
      });

      // then
      expect(error).to.be.instanceOf(NotFoundError);
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('when badge key is already used', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should throw a AlreadyExistingEntityError', async function () {
      // given
      badgeCreation.key = existingBadgeKey;

      // when
      // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
      const error = await catchErr(createBadge)({
        targetProfileId,
        badgeCreation,
        ...dependencies,
      });

      // then
      expect(error).to.be.instanceOf(AlreadyExistingEntityError);
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('when skillId is not attached to the corresponding target profile', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should throw a InvalidSkillSetError', async function () {
      // given
      Object.assign(badgeCreation, {
        skillSetThreshold: 99,
        skillSetName: 'skillset-name',
        skillSetSkillsIds: ['recSkill666'],
      });

      // when
      // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
      const error = await catchErr(createBadge)({
        targetProfileId,
        badgeCreation,
        ...dependencies,
      });

      // then
      expect(error).to.be.instanceOf(InvalidSkillSetError);
      expect(error).to.haveOwnProperty('message', 'Unknown skillIds : recSkill666');
    });
  });
});
