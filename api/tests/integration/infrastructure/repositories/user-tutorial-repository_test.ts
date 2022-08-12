// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, knex, databaseBuilder } = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'userTutori... Remove this comment to see the full error message
const userTutorialRepository = require('../../../../lib/infrastructure/repositories/user-tutorial-repository');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'UserSavedT... Remove this comment to see the full error message
const UserSavedTutorial = require('../../../../lib/domain/models/UserSavedTutorial');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Integration | Infrastructure | Repository | user-tutorial-repository', function () {
  let userId: $TSFixMe;

  // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
  beforeEach(async function () {
    userId = databaseBuilder.factory.buildUser().id;
    await databaseBuilder.commit();
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#addTutorial', function () {
    const tutorialId = 'tutorialId';

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when the skillId is null', function () {
      const skillId = null;

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should store the tutorialId in the users list', async function () {
        // when
        await userTutorialRepository.addTutorial({ userId, tutorialId, skillId });

        // then
        const userTutorials = await knex('user-saved-tutorials').where({ userId, tutorialId });
        expect(userTutorials).to.have.length(1);
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return the created user saved tutorial', async function () {
        // when
        const userTutorial = await userTutorialRepository.addTutorial({ userId, tutorialId, skillId });

        // then
        const savedUserTutorials = await knex('user-saved-tutorials').where({ userId, tutorialId });
        expect(userTutorial).to.be.instanceOf(UserSavedTutorial);
        expect(userTutorial.id).to.equal(savedUserTutorials[0].id);
        expect(userTutorial.userId).to.equal(savedUserTutorials[0].userId);
        expect(userTutorial.tutorialId).to.equal(savedUserTutorials[0].tutorialId);
        expect(userTutorial.skillId).to.equal(savedUserTutorials[0].skillId);
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when the skillId is provided', function () {
      const skillId = 'skillId';

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should store the tutorialId in the users list', async function () {
        // when
        await userTutorialRepository.addTutorial({ userId, tutorialId, skillId });

        // then
        const userTutorials = await knex('user-saved-tutorials').where({ userId, tutorialId });
        expect(userTutorials).to.have.length(1);
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return the created user saved tutorial', async function () {
        // when
        const userTutorial = await userTutorialRepository.addTutorial({ userId, tutorialId, skillId });

        // then
        const savedUserTutorials = await knex('user-saved-tutorials').where({ userId, tutorialId });
        expect(userTutorial).to.be.instanceOf(UserSavedTutorial);
        expect(userTutorial.id).to.equal(savedUserTutorials[0].id);
        expect(userTutorial.userId).to.equal(savedUserTutorials[0].userId);
        expect(userTutorial.tutorialId).to.equal(savedUserTutorials[0].tutorialId);
        expect(userTutorial.skillId).to.equal(savedUserTutorials[0].skillId);
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when the tutorialId already exists in the user list', function () {
      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('and the skillId is different', function () {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should not store a new user-saved-tutorial', async function () {
          // given
          const skillIdA = 'skillIdA';
          const skillIdB = 'skillIdB';
          databaseBuilder.factory.buildUserSavedTutorial({ tutorialId, userId, skillId: skillIdA });
          await databaseBuilder.commit();

          // when
          const userTutorial = await userTutorialRepository.addTutorial({ userId, tutorialId, skillIdB });

          // then
          const savedUserTutorials = await knex('user-saved-tutorials').where({ userId, tutorialId });
          expect(savedUserTutorials).to.have.length(1);
          expect(userTutorial).to.be.instanceOf(UserSavedTutorial);
          expect(userTutorial.id).to.equal(savedUserTutorials[0].id);
          expect(userTutorial.userId).to.equal(savedUserTutorials[0].userId);
          expect(userTutorial.tutorialId).to.equal(savedUserTutorials[0].tutorialId);
          expect(userTutorial.skillId).to.equal(skillIdA);
        });
      });

      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('and the skillId is the same', function () {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should not store a new user-saved-tutorial', async function () {
          // given
          const skillId = 'skillId';
          databaseBuilder.factory.buildUserSavedTutorial({ tutorialId, userId, skillId });
          await databaseBuilder.commit();

          // when
          const userTutorial = await userTutorialRepository.addTutorial({ userId, tutorialId, skillId });

          // then
          const savedUserTutorials = await knex('user-saved-tutorials').where({ userId, tutorialId });
          expect(savedUserTutorials).to.have.length(1);
          expect(userTutorial).to.be.instanceOf(UserSavedTutorial);
          expect(userTutorial.id).to.equal(savedUserTutorials[0].id);
          expect(userTutorial.userId).to.equal(savedUserTutorials[0].userId);
          expect(userTutorial.tutorialId).to.equal(savedUserTutorials[0].tutorialId);
          expect(userTutorial.skillId).to.equal(savedUserTutorials[0].skillId);
        });
      });
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#find', function () {
    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when user has saved tutorials', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return user-saved-tutorials belonging to given user ordered by descending id', async function () {
        // given
        const userSavedTuto1 = databaseBuilder.factory.buildUserSavedTutorial({
          tutorialId: 'recTutorial',
          userId,
          createdAt: new Date('2022-04-29'),
        });
        const userSavedTuto2 = databaseBuilder.factory.buildUserSavedTutorial({
          tutorialId: 'recTutorial2',
          userId,
          createdAt: new Date('2022-05-02'),
        });
        await databaseBuilder.commit();

        // when
        const userTutorials = await userTutorialRepository.find({ userId });

        // then
        expect(userTutorials).to.have.length(2);
        expect(userTutorials[0]).to.be.instanceOf(UserSavedTutorial);
        expect(userTutorials[0]).to.have.property('tutorialId', 'recTutorial2');
        expect(userTutorials[0]).to.have.property('userId', userId);
        expect(userTutorials[0].createdAt).to.deep.equal(userSavedTuto2.createdAt);
        expect(userTutorials[0].skillId).to.equal(null);
        expect(userTutorials[0].id).to.equal(userSavedTuto2.id);
        expect(userTutorials[1].id).to.equal(userSavedTuto1.id);
        expect(userTutorials[1].createdAt).to.deep.equal(userSavedTuto1.createdAt);
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when user has not saved tutorial', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return an empty list', async function () {
        const userTutorials = await userTutorialRepository.find({ userId });

        // then
        expect(userTutorials).to.deep.equal([]);
      });
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#removeFromUser', function () {
    const tutorialId = 'tutorialId';

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should delete the user saved tutorial', async function () {
      // given
      databaseBuilder.factory.buildUserSavedTutorial({ tutorialId, userId });
      await databaseBuilder.commit();

      // when
      await userTutorialRepository.removeFromUser({ userId, tutorialId });
      const userTutorials = await knex('user-saved-tutorials').where({ userId, tutorialId });

      // then
      expect(userTutorials).to.have.length(0);
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when the tutorialId does not exist in the user list', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should do nothing', async function () {
        // when
        await userTutorialRepository.removeFromUser({ userId, tutorialId });
        const userTutorials = await knex('user-saved-tutorials').where({ userId, tutorialId });

        // then
        expect(userTutorials).to.have.length(0);
      });
    });
  });
});
