import { expect } from 'chai';
import { describe, it } from 'mocha';
import { setupTest } from 'ember-mocha';

describe('Unit | Serializer | assessment', function () {
  setupTest();

  it('should add challenge id attribute from adapter options', function () {
    const store = this.owner.lookup('service:store');
    const serializer = this.owner.lookup('serializer:assessment');
    const record = store.createRecord('assessment', { answers: [] });
    const snapshot = record._createSnapshot();
    snapshot.adapterOptions = {
      challengeId: 'challenge1',
    };

    const json = serializer.serialize(snapshot);

    expect(json.data.attributes['challenge-id']).to.equal('challenge1');
  });
});
