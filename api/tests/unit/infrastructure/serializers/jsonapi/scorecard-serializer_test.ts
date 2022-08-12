// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, domainBuilder } = require('../../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'serializer... Remove this comment to see the full error message
const serializer = require('../../../../../lib/infrastructure/serializers/jsonapi/scorecard-serializer');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Serializer | JSONAPI | scorecard-serializer', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#serialize()', function () {
    const expectedTutorials = [
      // TODO: Fix this the next time the file is edited.
      // eslint-disable-next-line mocha/no-setup-in-describe
      domainBuilder.buildTutorial({ id: 'recTuto1' }),
      // TODO: Fix this the next time the file is edited.
      // eslint-disable-next-line mocha/no-setup-in-describe
      domainBuilder.buildTutorial({ id: 'recTuto2' }),
    ];

    // TODO: Fix this the next time the file is edited.
    // eslint-disable-next-line mocha/no-setup-in-describe
    const scorecardObject = domainBuilder.buildUserScorecard({ tutorials: expectedTutorials });

    const expectedSerializedScorecard = {
      data: {
        type: 'scorecards',
        // TODO: Fix this the next time the file is edited.
        // eslint-disable-next-line mocha/no-setup-in-describe
        id: scorecardObject.id,
        attributes: {
          // TODO: Fix this the next time the file is edited.
          // eslint-disable-next-line mocha/no-setup-in-describe
          name: scorecardObject.name,
          // TODO: Fix this the next time the file is edited.
          // eslint-disable-next-line mocha/no-setup-in-describe
          description: scorecardObject.description,
          // TODO: Fix this the next time the file is edited.
          // eslint-disable-next-line mocha/no-setup-in-describe
          index: scorecardObject.index,
          // TODO: Fix this the next time the file is edited.
          // eslint-disable-next-line mocha/no-setup-in-describe
          'competence-id': scorecardObject.competenceId,
          // TODO: Fix this the next time the file is edited.
          // eslint-disable-next-line mocha/no-setup-in-describe
          'earned-pix': scorecardObject.earnedPix,
          // TODO: Fix this the next time the file is edited.
          // eslint-disable-next-line mocha/no-setup-in-describe
          level: scorecardObject.level,
          // TODO: Fix this the next time the file is edited.
          // eslint-disable-next-line mocha/no-setup-in-describe
          'pix-score-ahead-of-next-level': scorecardObject.pixScoreAheadOfNextLevel,
          // TODO: Fix this the next time the file is edited.
          // eslint-disable-next-line mocha/no-setup-in-describe
          status: scorecardObject.status,
        },
        relationships: {
          area: {
            data: {
              // TODO: Fix this the next time the file is edited.
              // eslint-disable-next-line mocha/no-setup-in-describe
              id: scorecardObject.area.id,
              type: 'areas',
            },
          },
          tutorials: {
            links: {
              // TODO: Fix this the next time the file is edited.
              // eslint-disable-next-line mocha/no-setup-in-describe
              related: `/api/scorecards/${scorecardObject.id}/tutorials`,
            },
          },
        },
      },
      included: [
        {
          attributes: {
            // TODO: Fix this the next time the file is edited.
            // eslint-disable-next-line mocha/no-setup-in-describe
            code: scorecardObject.area.code,
            // TODO: Fix this the next time the file is edited.
            // eslint-disable-next-line mocha/no-setup-in-describe
            title: scorecardObject.area.title,
            // TODO: Fix this the next time the file is edited.
            // eslint-disable-next-line mocha/no-setup-in-describe
            color: scorecardObject.area.color,
          },
          // TODO: Fix this the next time the file is edited.
          // eslint-disable-next-line mocha/no-setup-in-describe
          id: scorecardObject.area.id,
          type: 'areas',
        },
        {
          attributes: {
            // TODO: Fix this the next time the file is edited.
            // eslint-disable-next-line mocha/no-setup-in-describe
            ...expectedTutorials[0],
          },
          // TODO: Fix this the next time the file is edited.
          // eslint-disable-next-line mocha/no-setup-in-describe
          id: expectedTutorials[0].id,
          type: 'tutorials',
        },
        {
          attributes: {
            // TODO: Fix this the next time the file is edited.
            // eslint-disable-next-line mocha/no-setup-in-describe
            ...expectedTutorials[1],
          },
          // TODO: Fix this the next time the file is edited.
          // eslint-disable-next-line mocha/no-setup-in-describe
          id: expectedTutorials[1].id,
          type: 'tutorials',
        },
      ],
    };

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should convert a scorecard object into JSON API data', function () {
      // when
      const json = serializer.serialize(scorecardObject);

      // then
      expect(json).to.deep.equal(expectedSerializedScorecard);
      expect(json.included[1].attributes).to.deep.equal(expectedTutorials[0]);
      expect(json.included[2].attributes).to.deep.equal(expectedTutorials[1]);
    });
  });
});
