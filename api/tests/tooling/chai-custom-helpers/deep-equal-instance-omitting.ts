// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = function (chai: $TSFixMe, _utils: $TSFixMe) {
  chai.Assertion.addMethod('deepEqualInstanceOmitting', function(this: $TSFixMe, referenceInstance: $TSFixMe, omittedAttributes: $TSFixMe) {
    const assertedInstance = this._obj;

    _assertAreSameType(chai, assertedInstance, referenceInstance);
    _assertHaveSameContent(chai, assertedInstance, referenceInstance, omittedAttributes);
  });
};

// @ts-expect-error TS(2393): Duplicate function implementation.
function _assertAreSameType(chai: $TSFixMe, value1: $TSFixMe, value2: $TSFixMe) {
  const instanceClassName1 = value1.constructor.name;
  const instanceClassName2 = value2.constructor.name;
  new chai.Assertion(instanceClassName1).to.equal(instanceClassName2);
}

// @ts-expect-error TS(2393): Duplicate function implementation.
function _assertHaveSameContent(chai: $TSFixMe, value1: $TSFixMe, value2: $TSFixMe, omittedAttributes: $TSFixMe) {
  new chai.Assertion(_.omit(value1, omittedAttributes)).to.deep.equal(_.omit(value2, omittedAttributes));
}
