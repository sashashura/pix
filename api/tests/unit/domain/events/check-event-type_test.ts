// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, catchErr } = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'checkEvent... Remove this comment to see the full error message
const { checkEventTypes } = require('../../../../lib/domain/events/check-event-types');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Domain | Events | check-event-types', function () {
  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('throw with right message when event of wrong type ', async function () {
    // given
    const wrongTypeEvent = 'Event of wrong type';

    // when
    // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
    const error = await catchErr(checkEventTypes)(wrongTypeEvent, [TestEvent1, TestEvent2]);

    // then
expect((error as $TSFixMe).message).to.equal('event must be one of types TestEvent1, TestEvent2');
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('accepts an event of correct type ', async function () {
    // given
    const correctTypeEvent = new TestEvent1();

    // when / then
    expect(() => {
      checkEventTypes(correctTypeEvent, [TestEvent1, TestEvent2]);
    }).not.to.throw();
  });
});

class TestEvent1 {}

class TestEvent2 {}
