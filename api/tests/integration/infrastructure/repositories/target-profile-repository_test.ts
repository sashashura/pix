// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, databaseBuilder, catchErr, sinon, knex } = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'TargetProf... Remove this comment to see the full error message
const TargetProfile = require('../../../../lib/domain/models/TargetProfile');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'TargetProf... Remove this comment to see the full error message
const TargetProfileForCreation = require('../../../../lib/domain/models/TargetProfileForCreation');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Skill'.
const Skill = require('../../../../lib/domain/models/Skill');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'targetProf... Remove this comment to see the full error message
const targetProfileRepository = require('../../../../lib/infrastructure/repositories/target-profile-repository');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'skillDatas... Remove this comment to see the full error message
const skillDatasource = require('../../../../lib/infrastructure/datasources/learning-content/skill-datasource');
const {
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'NotFoundEr... Remove this comment to see the full error message
  NotFoundError,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'ObjectVali... Remove this comment to see the full error message
  ObjectValidationError,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'InvalidSki... Remove this comment to see the full error message
  InvalidSkillSetError,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Organizati... Remove this comment to see the full error message
  OrganizationNotFoundError,
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
} = require('../../../../lib/domain/errors');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Integration | Repository | Target-profile', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#create', function () {
    // @ts-expect-error TS(2304): Cannot find name 'afterEach'.
    afterEach(async function () {
      await knex('target-profile_tubes').delete();
      await knex('target-profiles_skills').delete();
      await knex('target-profiles').delete();
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return the created target profile', async function () {
      const targetProfileForCreation = new TargetProfileForCreation({
        name: 'myFirstTargetProfile',
        imageUrl: 'someUrl',
        isPublic: true,
        ownerOrganizationId: null,
        skillIds: [1],
        description: 'public description of target profile',
        comment: 'This is a high level target profile',
        category: TargetProfile.categories.SUBJECT,
        tubes: [],
      });
      // when
      const targetProfileId = await targetProfileRepository.create(targetProfileForCreation);

      const [targetProfile] = await knex('target-profiles')
        .select([
          'name',
          'imageUrl',
          'outdated',
          'isPublic',
          'ownerOrganizationId',
          'comment',
          'description',
          'category',
        ])
        .where({ id: targetProfileId });

      // then
      expect(targetProfile.name).to.equal(targetProfileForCreation.name);
      expect(targetProfile.imageUrl).to.equal(targetProfileForCreation.imageUrl);
      expect(targetProfile.outdated).to.equal(false);
      expect(targetProfile.isPublic).to.equal(targetProfileForCreation.isPublic);
      expect(targetProfile.ownerOrganizationId).to.equal(targetProfileForCreation.ownerOrganizationId);
      expect(targetProfile.comment).to.equal(targetProfileForCreation.comment);
      expect(targetProfile.description).to.equal(targetProfileForCreation.description);
      expect(targetProfile.category).to.equal(TargetProfile.categories.SUBJECT);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should attach each skillId once to target profile', async function () {
      const targetProfileForCreation = new TargetProfileForCreation({
        name: 'myFirstTargetProfile',
        skillIds: ['skills1', 'skills2', 'skills2'],
        tubes: [],
      });
      // when
      const targetProfileId = await targetProfileRepository.create(targetProfileForCreation);

      const skillsList = await knex('target-profiles_skills')
        .select(['skillId'])
        .where({ targetProfileId: targetProfileId });

      const skillsId = skillsList.map((skill: $TSFixMe) => skill.skillId);
      // then
      expect(skillsId).to.exactlyContain(['skills1', 'skills2']);
    });

    // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
    describe('with tubes', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should save the target profile and its tubes', async function () {
        // given
        const targetProfileForCreation = new TargetProfileForCreation({
          name: 'myFirstTargetProfile',
          imageUrl: 'someUrl',
          isPublic: true,
          ownerOrganizationId: null,
          skillIds: [1],
          description: 'public description of target profile',
          comment: 'This is a high level target profile',
          category: TargetProfile.categories.SUBJECT,
          tubes: [
            { id: 'tubeId1', level: 8 },
            { id: 'tubeId2', level: 4 },
            { id: 'tubeId3', level: 5 },
          ],
        });

        // when
        const targetProfileId = await targetProfileRepository.create(targetProfileForCreation);

        // then
        const tubesList = await knex('target-profile_tubes')
          .select(['tubeId', 'level'])
          .where({ targetProfileId })
          .orderBy('tubeId');

        // then
        expect(tubesList).to.exactlyContain([
          { tubeId: 'tubeId1', level: 8 },
          { tubeId: 'tubeId2', level: 4 },
          { tubeId: 'tubeId3', level: 5 },
        ]);
      });
    });

    // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
    describe("when organization doesn't exist", function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should throw an OrganizationNotFoundError', async function () {
        const targetProfileForCreation = new TargetProfileForCreation({
          name: 'myFirstTargetProfile',
          skillIds: ['skills1', 'skills2', 'skills2'],
          ownerOrganizationId: -1,
        });

        // when
        // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
        const error = await catchErr(targetProfileRepository.create)(targetProfileForCreation);

        // then
        expect(error).to.be.instanceOf(OrganizationNotFoundError);
      });
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#get', function () {
    let targetProfile: $TSFixMe;
    let targetProfileFirstSkill: $TSFixMe;
    let skillAssociatedToTargetProfile: $TSFixMe;
    let organizationId;

    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(async function () {
      organizationId = databaseBuilder.factory.buildOrganization({}).id;
      targetProfile = databaseBuilder.factory.buildTargetProfile({});
      targetProfileFirstSkill = databaseBuilder.factory.buildTargetProfileSkill({ targetProfileId: targetProfile.id });
      databaseBuilder.factory.buildTargetProfileShare({ targetProfileId: targetProfile.id, organizationId });
      await databaseBuilder.commit();

      skillAssociatedToTargetProfile = { id: targetProfileFirstSkill.skillId, name: '@Acquis2' };
      sinon.stub(skillDatasource, 'findOperativeByRecordIds').resolves([skillAssociatedToTargetProfile]);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return the target profile with its associated skills and the list of organizations which could access it', function () {
      // when
      const promise = targetProfileRepository.get(targetProfile.id);

      // then
      return promise.then((foundTargetProfile: $TSFixMe) => {
        expect(skillDatasource.findOperativeByRecordIds).to.have.been.calledWith([targetProfileFirstSkill.skillId]);

        expect(foundTargetProfile).to.be.an.instanceOf(TargetProfile);

        expect(foundTargetProfile.skills).to.be.an('array');
        expect(foundTargetProfile.skills.length).to.equal(1);
        expect(foundTargetProfile.skills[0]).to.be.an.instanceOf(Skill);
        expect(foundTargetProfile.skills[0].id).to.equal(skillAssociatedToTargetProfile.id);
        expect(foundTargetProfile.skills[0].name).to.equal(skillAssociatedToTargetProfile.name);
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when the targetProfile does not exist', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('throws an error', async function () {
        // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
        const error = await catchErr(targetProfileRepository.get)(1);

        expect(error).to.be.an.instanceOf(NotFoundError);
        expect((error as $TSFixMe).message).to.have.string("Le profil cible avec l'id 1 n'existe pas");
      });
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#findAllTargetProfilesOrganizationCanUse', function () {
    let ownerOrganizationId: $TSFixMe;
    let ownerOtherOrganizationId;
    let targetProfileSkill: $TSFixMe;

    let organizationTargetProfile: $TSFixMe;
    let organizationTargetProfilePublic: $TSFixMe;
    let publicTargetProfile: $TSFixMe;

    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(async function () {
      ownerOrganizationId = databaseBuilder.factory.buildOrganization().id;
      ownerOtherOrganizationId = databaseBuilder.factory.buildOrganization().id;

      organizationTargetProfile = databaseBuilder.factory.buildTargetProfile({ ownerOrganizationId, isPublic: false });
      organizationTargetProfilePublic = databaseBuilder.factory.buildTargetProfile({
        ownerOrganizationId,
        isPublic: true,
      });
      publicTargetProfile = databaseBuilder.factory.buildTargetProfile({ ownerOrganizationId: null, isPublic: true });
      databaseBuilder.factory.buildTargetProfile({ ownerOrganizationId: ownerOtherOrganizationId, isPublic: false });
      databaseBuilder.factory.buildTargetProfile({ ownerOrganizationId: null, isPublic: true, outdated: true });
      databaseBuilder.factory.buildTargetProfile({ ownerOrganizationId, isPublic: false, outdated: true });

      const targetProfileSkillAssociation = databaseBuilder.factory.buildTargetProfileSkill({
        targetProfileId: organizationTargetProfile.id,
      });
      await databaseBuilder.commit();

      targetProfileSkill = { id: targetProfileSkillAssociation.skillId, name: '@Acquis2' };
      sinon.stub(skillDatasource, 'findOperativeByRecordIds').resolves([targetProfileSkill]);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return an Array', async function () {
      // when
      const foundTargetProfiles = await targetProfileRepository.findAllTargetProfilesOrganizationCanUse(
        ownerOrganizationId
      );

      // then
      expect(foundTargetProfiles).to.be.an('array');
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return all the target profile the organization can access but not outdated', async function () {
      // when
      const foundTargetProfiles = await targetProfileRepository.findAllTargetProfilesOrganizationCanUse(
        ownerOrganizationId
      );

      // then
      expect(foundTargetProfiles[0]).to.be.an.instanceOf(TargetProfile);
      expect(foundTargetProfiles).to.have.lengthOf(3);
      expect(foundTargetProfiles[0].name).to.equal(organizationTargetProfile.name);
      expect(foundTargetProfiles[1].name).to.equal(organizationTargetProfilePublic.name);
      expect(foundTargetProfiles[2].name).to.equal(publicTargetProfile.name);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should contain skills linked to every target profiles', function () {
      // when
      const promise = targetProfileRepository.findAllTargetProfilesOrganizationCanUse(ownerOrganizationId);

      // then
      return promise.then((targetProfiles: $TSFixMe) => {
        const targetProfileSkills = targetProfiles[0].skills;
        expect(targetProfileSkills).to.be.an('array');
        expect(targetProfileSkills.length).to.equal(1);

        const skill = targetProfileSkills[0];
        expect(skill).to.be.an.instanceOf(Skill);
        expect(skill.id).to.equal(targetProfileSkill.id);
        expect(skill.name).to.equal(targetProfileSkill.name);
      });
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#getByCampaignId', function () {
    let campaignId: $TSFixMe, targetProfileId: $TSFixMe;

    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(async function () {
      targetProfileId = databaseBuilder.factory.buildTargetProfile().id;
      campaignId = databaseBuilder.factory.buildCampaign({ targetProfileId }).id;
      const { skillId } = databaseBuilder.factory.buildTargetProfileSkill({ targetProfileId });
      const skillAssociatedToTargetProfile = { id: skillId, name: '@Acquis2' };
      databaseBuilder.factory.buildTargetProfile();
      databaseBuilder.factory.buildCampaign();
      databaseBuilder.factory.buildStage({ targetProfileId, threshold: 40 });
      databaseBuilder.factory.buildStage({ targetProfileId, threshold: 20 });
      sinon.stub(skillDatasource, 'findOperativeByRecordIds').resolves([skillAssociatedToTargetProfile]);

      await databaseBuilder.commit();
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return the target profile matching the campaign id', async function () {
      // when
      const targetProfile = await targetProfileRepository.getByCampaignId(campaignId);

      // then
      expect(targetProfile.id).to.equal(targetProfileId);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return the target profile with the stages ordered by threshold ASC', async function () {
      // when
      const targetProfile = await targetProfileRepository.getByCampaignId(campaignId);

      // then
      expect(targetProfile.stages).to.exist;
      expect(targetProfile.stages).to.have.lengthOf(2);
      expect(targetProfile.stages[0].threshold).to.equal(20);
      expect(targetProfile.stages[1].threshold).to.equal(40);
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#getByCampaignParticipationId', function () {
    let campaignParticipationId: $TSFixMe, targetProfileId: $TSFixMe;

    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(async function () {
      const anotherTargetProfileId = databaseBuilder.factory.buildTargetProfile().id;
      const anotherCampaignId = databaseBuilder.factory.buildCampaign({ targetProfileId: anotherTargetProfileId }).id;
      databaseBuilder.factory.buildCampaignParticipation({ campaignId: anotherCampaignId });
      databaseBuilder.factory.buildTargetProfileSkill({ targetProfileId: anotherTargetProfileId });

      targetProfileId = databaseBuilder.factory.buildTargetProfile().id;
      const campaignId = databaseBuilder.factory.buildCampaign({ targetProfileId }).id;
      campaignParticipationId = databaseBuilder.factory.buildCampaignParticipation({ campaignId }).id;
      const { skillId } = databaseBuilder.factory.buildTargetProfileSkill({ targetProfileId });
      const skillAssociatedToTargetProfile = { id: skillId, name: '@Acquis2' };
      databaseBuilder.factory.buildTargetProfile();
      databaseBuilder.factory.buildCampaign();
      databaseBuilder.factory.buildStage({ targetProfileId, threshold: 40 });
      databaseBuilder.factory.buildStage({ targetProfileId, threshold: 20 });
      sinon.stub(skillDatasource, 'findOperativeByRecordIds').resolves([skillAssociatedToTargetProfile]);

      await databaseBuilder.commit();
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return the target profile matching the campaign participation id', async function () {
      // when
      const targetProfile = await targetProfileRepository.getByCampaignParticipationId(campaignParticipationId);

      // then
      expect(targetProfile.id).to.equal(targetProfileId);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return the target profile with the stages ordered by threshold ASC', async function () {
      // when
      const targetProfile = await targetProfileRepository.getByCampaignParticipationId(campaignParticipationId);

      // then
      expect(targetProfile.stages).to.exist;
      expect(targetProfile.stages).to.have.lengthOf(2);
      expect(targetProfile.stages[0].threshold).to.equal(20);
      expect(targetProfile.stages[1].threshold).to.equal(40);
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#findByIds', function () {
    let targetProfile1: $TSFixMe;
    let targetProfileIds;
    const targetProfileIdNotExisting = 999;

    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(async function () {
      targetProfile1 = databaseBuilder.factory.buildTargetProfile();
      await databaseBuilder.commit();
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return the target profile', async function () {
      // given
      targetProfileIds = [targetProfile1.id];

      const expectedTargetProfilesAttributes = _.map([targetProfile1], (item: $TSFixMe) => _.pick(item, ['id', 'isPublic', 'name', 'organizationId', 'outdated'])
      );

      // when
      const foundTargetProfiles = await targetProfileRepository.findByIds(targetProfileIds);

      // then
      const foundTargetProfilesAttributes = _.map(foundTargetProfiles, (item: $TSFixMe) => _.pick(item, ['id', 'isPublic', 'name', 'organizationId', 'outdated'])
      );
      expect(foundTargetProfilesAttributes).to.deep.equal(expectedTargetProfilesAttributes);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return found target profiles', async function () {
      // given
      const targetProfile2 = databaseBuilder.factory.buildTargetProfile();
      const targetProfile3 = databaseBuilder.factory.buildTargetProfile();
      await databaseBuilder.commit();

      targetProfileIds = [targetProfile1.id, targetProfileIdNotExisting, targetProfile2.id, targetProfile3.id];

      const expectedTargetProfilesAttributes = _.map([targetProfile1, targetProfile2, targetProfile3], (item: $TSFixMe) => _.pick(item, ['id', 'isPublic', 'name', 'organizationId', 'outdated'])
      );

      // when
      const foundTargetProfiles = await targetProfileRepository.findByIds(targetProfileIds);

      // then
      const foundTargetProfilesAttributes = _.map(foundTargetProfiles, (item: $TSFixMe) => _.pick(item, ['id', 'isPublic', 'name', 'organizationId', 'outdated'])
      );
      expect(foundTargetProfilesAttributes).to.deep.equal(expectedTargetProfilesAttributes);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return an empty array', async function () {
      // given
      targetProfileIds = [targetProfileIdNotExisting];

      // when
      const foundTargetProfiles = await targetProfileRepository.findByIds(targetProfileIds);

      // then
      const foundTargetProfilesAttributes = _.map(foundTargetProfiles, (item: $TSFixMe) => _.pick(item, ['id', 'isPublic', 'name', 'organizationId', 'outdated'])
      );
      expect(foundTargetProfilesAttributes).to.deep.equal([]);
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#findPaginatedFiltered', function () {
    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when there are target profiles in the database', function () {
      // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
      beforeEach(function () {
        _.times(3, databaseBuilder.factory.buildTargetProfile);
        return databaseBuilder.commit();
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return an Array of TargetProfiles', async function () {
        // given
        const filter = {};
        const page = { number: 1, size: 10 };
        const expectedPagination = { page: page.number, pageSize: page.size, pageCount: 1, rowCount: 3 };

        // when
        const { models: matchingTargetProfiles, pagination } = await targetProfileRepository.findPaginatedFiltered({
          filter,
          page,
        });

        // then
        expect(matchingTargetProfiles).to.exist;
        expect(matchingTargetProfiles).to.have.lengthOf(3);
        expect(matchingTargetProfiles[0]).to.be.an.instanceOf(TargetProfile);
        expect(pagination).to.deep.equal(expectedPagination);
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when there are lots of Target Profiles (> 10) in the database', function () {
      // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
      beforeEach(function () {
        _.times(12, databaseBuilder.factory.buildTargetProfile);
        return databaseBuilder.commit();
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return paginated matching Target Profiles', async function () {
        // given
        const filter = {};
        const page = { number: 1, size: 3 };
        const expectedPagination = { page: page.number, pageSize: page.size, pageCount: 4, rowCount: 12 };

        // when
        const { models: matchingTargetProfiles, pagination } = await targetProfileRepository.findPaginatedFiltered({
          filter,
          page,
        });

        // then
        expect(matchingTargetProfiles).to.have.lengthOf(3);
        expect(pagination).to.deep.equal(expectedPagination);
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when there are multiple Target Profiles matching the same "name" search pattern', function () {
      // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
      beforeEach(function () {
        databaseBuilder.factory.buildTargetProfile({ name: 'Dragon & co' });
        databaseBuilder.factory.buildTargetProfile({ name: 'Dragonades & co' });
        databaseBuilder.factory.buildTargetProfile({ name: 'Broca & co' });
        return databaseBuilder.commit();
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return only Target Profiles matching "name" if given in filters', async function () {
        // given
        const filter = { name: 'dra' };
        const page = { number: 1, size: 10 };

        // when
        const { models: matchingTargetProfiles } = await targetProfileRepository.findPaginatedFiltered({
          filter,
          page,
        });

        // then
        expect(matchingTargetProfiles).to.have.lengthOf(2);
        expect(_.map(matchingTargetProfiles, 'name')).to.have.members(['Dragon & co', 'Dragonades & co']);
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when there are multiple Target Profiles matching the same "id" search pattern', function () {
      // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
      beforeEach(function () {
        databaseBuilder.factory.buildTargetProfile({ id: 12345 });
        databaseBuilder.factory.buildTargetProfile({ id: 2345 });
        databaseBuilder.factory.buildTargetProfile({ id: 6789 });
        return databaseBuilder.commit();
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return only Target Profiles exactly matching "id" if given in filters', async function () {
        // given
        const filter = { id: '2345' };
        const page = { number: 1, size: 10 };

        // when
        const { models: matchingTargetProfiles } = await targetProfileRepository.findPaginatedFiltered({
          filter,
          page,
        });

        // then
        expect(matchingTargetProfiles).to.have.lengthOf(1);
        expect(matchingTargetProfiles[0].id).to.equal(2345);
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when there are multiple Target Profiles matching the fields "name", and "id" search pattern', function () {
      // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
      beforeEach(function () {
        databaseBuilder.factory.buildTargetProfile({ name: 'name_ok', id: 1234 });
        databaseBuilder.factory.buildTargetProfile({ name: 'name_ko', id: 1235 });
        databaseBuilder.factory.buildTargetProfile({ name: 'name_ok', id: 4567 });

        return databaseBuilder.commit();
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return only Target Profiles matching "id" AND "name" if given in filters', async function () {
        // given
        const filter = { name: 'name_ok', id: 1234 };
        const page = { number: 1, size: 10 };

        // when
        const { models: matchingTargetProfiles } = await targetProfileRepository.findPaginatedFiltered({
          filter,
          page,
        });

        // then
        expect(matchingTargetProfiles).to.have.lengthOf(1);
        expect(matchingTargetProfiles[0].name).to.equal('name_ok');
        expect(matchingTargetProfiles[0].id).to.equal(1234);
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when there are filters that should be ignored', function () {
      let targetProfileId1: $TSFixMe;
      let targetProfileId2: $TSFixMe;

      // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
      beforeEach(function () {
        targetProfileId1 = databaseBuilder.factory.buildTargetProfile().id;
        targetProfileId2 = databaseBuilder.factory.buildTargetProfile().id;

        return databaseBuilder.commit();
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should ignore the filters and retrieve all target profiles', async function () {
        // given
        const filter = { type: 1 };
        const page = { number: 1, size: 10 };

        // when
        const { models: matchingTargetProfiles } = await targetProfileRepository.findPaginatedFiltered({
          filter,
          page,
        });

        // then
        expect(_.map(matchingTargetProfiles, 'id')).to.have.members([targetProfileId1, targetProfileId2]);
      });
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#update', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should update the target profile name', async function () {
      // given
      const targetProfile = databaseBuilder.factory.buildTargetProfile({ name: 'Arthur' });
      await databaseBuilder.commit();

      // when
      targetProfile.name = 'Karam';
      await targetProfileRepository.update(targetProfile);

      // then
      const { name } = await knex('target-profiles').select('name').where('id', targetProfile.id).first();
      expect(name).to.equal(targetProfile.name);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should update the target profile description', async function () {
      // given
      const targetProfile = databaseBuilder.factory.buildTargetProfile();
      await databaseBuilder.commit();

      // when
      targetProfile.description = 'Je change la description';
      await targetProfileRepository.update(targetProfile);

      // then
      const { description } = await knex('target-profiles').select('description').where('id', targetProfile.id).first();
      expect(description).to.equal(targetProfile.description);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should update the target profile comment', async function () {
      // given
      const targetProfile = databaseBuilder.factory.buildTargetProfile();
      await databaseBuilder.commit();

      // when
      targetProfile.comment = 'Je change le commentaire';
      await targetProfileRepository.update(targetProfile);

      // then
      const { comment } = await knex('target-profiles').select('comment').where('id', targetProfile.id).first();
      expect(comment).to.equal(targetProfile.comment);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should outdate the target profile', async function () {
      // given
      const targetProfile = databaseBuilder.factory.buildTargetProfile({ outdated: true });
      await databaseBuilder.commit();

      // when
      targetProfile.outdate = true;
      await targetProfileRepository.update(targetProfile);

      // then
      const { outdated } = await knex('target-profiles').select('outdated').where('id', targetProfile.id).first();
      expect(outdated).to.equal(targetProfile.outdated);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should update and return the target profile "isSimplifiedAccess" attribute', async function () {
      // given
      const targetProfile = databaseBuilder.factory.buildTargetProfile({ isSimplifiedAccess: false });
      await databaseBuilder.commit();

      // when
      targetProfile.isSimplifiedAccess = true;
      const result = await targetProfileRepository.update(targetProfile);

      // then
      expect(result).to.be.instanceOf(TargetProfile);
      expect(result.isSimplifiedAccess).to.equal(true);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should not update the target profile and throw an error while id not existing', async function () {
      // given
      const targetProfile = databaseBuilder.factory.buildTargetProfile({ name: 'Arthur' });
      await databaseBuilder.commit();

      // when
      targetProfile.id = 999999;
      targetProfile.name = 'Karam';
      // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
      const error = await catchErr(targetProfileRepository.update)(targetProfile);

      // then
      expect(error).to.be.instanceOf(NotFoundError);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should not update the target profile name for an database error', async function () {
      // given
      const targetProfile = databaseBuilder.factory.buildTargetProfile({ name: 'Arthur' });
      await databaseBuilder.commit();

      // when
      targetProfile.name = null;
      // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
      const error = await catchErr(targetProfileRepository.update)(targetProfile);

      // then
      expect(error).to.be.instanceOf(ObjectValidationError);
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#findOrganizationIds', function () {
    let targetProfileId: $TSFixMe;
    const expectedOrganizationIds: $TSFixMe = [];

    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(function () {
      targetProfileId = databaseBuilder.factory.buildTargetProfile().id;
      _.times(2, () => {
        const organizationId = databaseBuilder.factory.buildOrganization().id;
        expectedOrganizationIds.push(organizationId);
        databaseBuilder.factory.buildTargetProfileShare({ organizationId, targetProfileId });
      });
      return databaseBuilder.commit();
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when there are organizations linked to the target profile', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return an Array of Organization ids', async function () {
        const organizationIds = await targetProfileRepository.findOrganizationIds(targetProfileId);

        expect(organizationIds).to.be.an('array');
        expect(organizationIds).to.deep.equal(expectedOrganizationIds);
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should not include an organization that is not attach to target profile', async function () {
        databaseBuilder.factory.buildOrganization();
        await databaseBuilder.commit();

        const organizationIds = await targetProfileRepository.findOrganizationIds(targetProfileId);

        expect(organizationIds).to.have.lengthOf(2);
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when no organization is linked to the target profile', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return an empty array', async function () {
        const otherTargetProfileId = databaseBuilder.factory.buildTargetProfile().id;
        await databaseBuilder.commit();

        const organizationIds = await targetProfileRepository.findOrganizationIds(otherTargetProfileId);

        expect(organizationIds).to.deep.equal([]);
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when target profile does not exist', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should throw', async function () {
        // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
        const error = await catchErr(targetProfileRepository.findOrganizationIds)(999);

        expect(error).to.be.instanceOf(NotFoundError);
      });
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#hasSkills', function () {
    let targetProfileId: $TSFixMe;

    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(function () {
      targetProfileId = databaseBuilder.factory.buildTargetProfile().id;
      databaseBuilder.factory.buildTargetProfileSkill({ targetProfileId, skillId: 'recSkill1' });
      databaseBuilder.factory.buildTargetProfileSkill({ targetProfileId, skillId: 'recSkill2' });

      return databaseBuilder.commit();
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when all skillIds belong to target profile', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return true', async function () {
        // given
        const skillIds = ['recSkill1', 'recSkill2'];

        // when
        const result = await targetProfileRepository.hasSkills({ targetProfileId, skillIds });

        // then
        expect(result).to.be.true;
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context("when at least one skillId doesn't belong to target profile", function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should throw an error', async function () {
        // given
        const skillIds = ['recSkill1', 'recSkill666', 'recSkill2'];

        // when
        // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
        const error = await catchErr(targetProfileRepository.hasSkills)({ targetProfileId, skillIds });

        // then
        expect(error).to.be.instanceOf(InvalidSkillSetError);
        expect(error).to.haveOwnProperty('message', 'Unknown skillIds : recSkill666');
      });
    });
  });
});
