// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect } = require('../../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'ReachedSta... Remove this comment to see the full error message
const ReachedStage = require('../../../../../lib/domain/read-models/participant-results/ReachedStage');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Domain | Read-Models | ParticipantResults | ReachedStage', function () {
  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('gives the stage reached and the number of stars', function () {
    const stages = [
      { id: 1, title: 'Stage1', message: 'message1', threshold: 25 },
      { id: 2, title: 'Stage2', message: 'message2', threshold: 60 },
      { id: 3, title: 'Stage3', message: 'message3', threshold: 90 },
    ];

    const profileStage = new ReachedStage(0.66, stages);

    expect(profileStage).to.deep.equal({
      id: 2,
      title: 'Stage2',
      message: 'message2',
      threshold: 60,
      starCount: 2,
    });
  });
});
