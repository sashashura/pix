// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect } = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'injectDepe... Remove this comment to see the full error message
const { injectDependencies } = require('../../../../lib/infrastructure/utils/dependency-injection');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Utils | #injectDependencies', function () {
  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('should inject dependencies by name', function () {
    // given
    const dependency = Symbol('a dependency');
    const dependencies = { dependency };
    const toBeInjected = {
      functionToBeInjected: function ({
        dependency
      }: $TSFixMe) {
        return dependency;
      },
    };

    // when
    const injected = injectDependencies(toBeInjected, dependencies);

    // then
    expect(injected.functionToBeInjected({})).to.equal(dependency);
  });
});
