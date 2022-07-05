import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import Service from '@ember/service';
import sinon from 'sinon';

module('Unit | Route | authenticated', function (hooks) {
  setupTest(hooks);
  module('when an error occurs', function () {
    module('when api responds with a 403', function () {
      test('it should invalidate user session', function (assert) {
        // given
        const route = this.owner.lookup('route:authenticated');
        const error403 = {
          errors: [{ code: 403, details: 'some error details', meta: 'SECURITY_PREHANDLER_NOT_ALLOWED' }],
        };

        const invalidateStub = sinon.stub();
        class SessionStub extends Service {
          invalidate = invalidateStub;
        }
        this.owner.register('service:session', SessionStub);

        // when
        route.error(error403);

        // then
        sinon.assert.calledOnce(invalidateStub);
        assert.ok(true);
      });
    });
  });
});
