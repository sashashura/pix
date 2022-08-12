// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = function (chai: $TSFixMe, _utils: $TSFixMe) {
  chai.Assertion.addMethod('deepEqualInstance', function(this: $TSFixMe, referenceInstance: $TSFixMe) {
    const assertedInstance = this._obj;

    _assertAreSameType(chai, assertedInstance, referenceInstance);
    _assertHaveSameContent(chai, assertedInstance, referenceInstance);
  });
};

function _assertAreSameType(chai: $TSFixMe, value1: $TSFixMe, value2: $TSFixMe) {
  const instanceClassName1 = value1.constructor.name;
  const instanceClassName2 = value2.constructor.name;
  new chai.Assertion(instanceClassName1).to.equal(instanceClassName2);
}

function _assertHaveSameContent(chai: $TSFixMe, value1: $TSFixMe, value2: $TSFixMe) {
  new chai.Assertion(value1).to.deep.equal(value2);
}
