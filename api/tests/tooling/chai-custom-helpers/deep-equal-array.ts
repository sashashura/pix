// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = function (chai: $TSFixMe, _utils: $TSFixMe) {
  chai.Assertion.addMethod('deepEqualArray', function(this: $TSFixMe, referenceArray: $TSFixMe) {
    const assertedArray = this._obj;

    _assertIsArray(chai, assertedArray);
    _assertIsArray(chai, referenceArray);
    _assertArraysHaveSameLength(chai, assertedArray, referenceArray);

    for (let i = 0; i < assertedArray.length; ++i) {
      _assertDeepEqualInstance(chai, assertedArray[i], referenceArray[i]);
    }
  });
};

function _assertIsArray(chai: $TSFixMe, value: $TSFixMe) {
  const instanceClassName = value.constructor.name;
  new chai.Assertion(instanceClassName).to.equal('Array');
}

function _assertArraysHaveSameLength(chai: $TSFixMe, array1: $TSFixMe, array2: $TSFixMe) {
  const array1Length = array1.length;
  const array2Length = array2.length;
  new chai.Assertion(array1Length).to.equal(array2Length);
}

function _assertDeepEqualInstance(chai: $TSFixMe, instance1: $TSFixMe, instance2: $TSFixMe) {
  new chai.Assertion(instance1).to.deepEqualInstance(instance2);
}
