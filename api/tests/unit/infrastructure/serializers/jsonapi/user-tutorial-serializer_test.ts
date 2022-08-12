// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, domainBuilder } = require('../../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'serializer... Remove this comment to see the full error message
const serializer = require('../../../../../lib/infrastructure/serializers/jsonapi/user-tutorial-serializer');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'UserSavedT... Remove this comment to see the full error message
const UserSavedTutorial = require('../../../../../lib/domain/models/UserSavedTutorial');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Serializer | JSONAPI | user-tutorial-serializer', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#serialize', function () {
    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when there is only user tutorial', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should serialize', function () {
        // given
        const userTutorial = {
          id: 'userTutorialId',
          userId: 'userId',
          tutorialId: 'tutorialId',
          skillId: 'skillId',
        };
        const expectedJsonUserTutorial = {
          data: {
            type: 'user-tutorials',
            id: 'userTutorialId',
            attributes: {
              'user-id': 'userId',
              'tutorial-id': 'tutorialId',
              'skill-id': 'skillId',
            },
          },
        };
        // when
        const json = serializer.serialize(userTutorial);

        // then
        expect(json).to.be.deep.equal(expectedJsonUserTutorial);
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when there is user tutorial and tutorial', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should serialize', function () {
        // given
        const tutorial = domainBuilder.buildTutorial({ id: 'tutorialId' });
        const userTutorialWithTutorial = domainBuilder.buildUserSavedTutorialWithTutorial({
          id: 123,
          userId: 456,
          tutorial,
          skillId: 'skillId',
        });
        const expectedJsonUserTutorial = {
          data: {
            type: 'user-tutorials',
            id: '123',
            attributes: {
              'user-id': 456,
              'skill-id': 'skillId',
            },
            relationships: {
              tutorial: {
                data: {
                  id: 'tutorialId',
                  type: 'tutorials',
                },
              },
            },
          },
          included: [
            {
              attributes: {
                duration: '00:01:30',
                format: 'video',
                id: 'tutorialId',
                link: 'https://youtube.fr',
                source: 'Youtube',
                title: 'Savoir regarder des vidéos youtube.',
              },
              id: 'tutorialId',
              type: 'tutorials',
            },
          ],
        };
        // when
        const json = serializer.serialize(userTutorialWithTutorial);

        // then
        expect(json).to.be.deep.equal(expectedJsonUserTutorial);
      });
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#deserialize', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should convert JSON API data into an User model object', function () {
      // given
      const jsonUserTutorial = {
        data: {
          id: 123,
          type: 'user-tutorials',
          attributes: {
            'skill-id': 'skillId',
          },
          relationships: {},
        },
      };

      // when
      const userTutorial = serializer.deserialize(jsonUserTutorial);

      // then
      expect(userTutorial).to.be.instanceOf(UserSavedTutorial);
      expect(userTutorial.id).to.be.equal(123);
      expect(userTutorial.skillId).to.be.equal('skillId');
    });
  });
});
