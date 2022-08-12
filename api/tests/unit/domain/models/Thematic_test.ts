// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Thematic'.
const Thematic = require('../../../../lib/domain/models/Thematic');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect } = require('../../../test-helper');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Domain | Models | Thematic', function () {
  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('should return a thematic', function () {
    // given
    const thematic = new Thematic({ id: '1', name: 'Test', index: 0, tubeIds: ['1', '2'] });

    // then
    expect(thematic.id).to.be.equal('1');
    expect(thematic.name).to.be.equal('Test');
    expect(thematic.index).to.be.equal(0);
    expect(thematic.tubeIds).to.be.deep.equal(['1', '2']);
  });
});
