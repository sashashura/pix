import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import EmberObject from '@ember/object';

module('Integration | Component | certification-list', function(hooks) {

  setupRenderingTest(hooks);

  test('it should display a list of certifications', async function(assert) {
    // given
    this.set('noop', () => {});
    const certifications = [
      EmberObject.create({ id: 1 }),
      EmberObject.create({ id: 2 }),
      EmberObject.create({ id: 3 }),
    ];
    this.set('certifications', certifications);
    certifications.meta = { rowCount: 3 };

    // when
    await render(hbs`<CertificationList @certifications={{certifications}} @triggerFiltering={{noop}}/>`);

    // then
    assert.dom('[aria-label="Certification"]').exists({ count: 3 });
  });

  test('it should certification details', async function(assert) {
    // given
    this.set('noop', () => {});
    const certifications = [
      EmberObject.create({
        id: 675,
        firstName: 'Brigitte',
        lastName: 'Wonda',
        status: 'a status',
        pixScore: '42',
        creationDate: '2018-02-02',
        completionDate: '2020-10-10',
        isPublished: true
      }),
    ];
    this.set('certifications', certifications);
    certifications.meta = { rowCount: 1 };

    // when
    await render(hbs`<CertificationList @certifications={{certifications}} @triggerFiltering={{noop}}/>`);

    // then
    assert.dom('[aria-label="Certification"]').containsText('675');
    assert.dom('[aria-label="Certification"]').containsText('Brigitte');
    assert.dom('[aria-label="Certification"]').containsText('Wonda');
    assert.dom('[aria-label="Certification"]').containsText('a status');
    assert.dom('[aria-label="Certification"]').containsText('42');
    assert.dom('[aria-label="Certification"]').containsText('2018-02-02');
    assert.dom('[aria-label="Certification"]').containsText('2020-10-10');
    assert.dom('[aria-label="Certification"]').containsText('publiée');
  });
});
