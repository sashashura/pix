// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const ErreurDoc = require('../../../../../lib/infrastructure/open-api-doc/pole-emploi/erreur-doc');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect } = require('../../../../test-helper');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Infrastructure | Open API Doc | Pole Emploi | Erreur Documentation', function () {
  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('should validate payload for a campaign participation', function () {
    // given
    const payload = {
      code: 'A1',
      titre: "Titre de l'erreur",
      statut: '400',
      detail: "Description de l'erreur",
    };

    // when
    const result = ErreurDoc.validate(payload);

    // then
    expect(result.error).to.be.undefined;
  });
});
