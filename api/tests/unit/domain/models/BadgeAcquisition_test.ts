// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, domainBuilder } = require('../../../test-helper');
const {
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'PIX_EMPLOI... Remove this comment to see the full error message
  PIX_EMPLOI_CLEA_V1,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'PIX_EMPLOI... Remove this comment to see the full error message
  PIX_EMPLOI_CLEA_V2,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'PIX_EMPLOI... Remove this comment to see the full error message
  PIX_EMPLOI_CLEA_V3,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'PIX_DROIT_... Remove this comment to see the full error message
  PIX_DROIT_MAITRE_CERTIF,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'PIX_DROIT_... Remove this comment to see the full error message
  PIX_DROIT_EXPERT_CERTIF,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'PIX_EDU_FO... Remove this comment to see the full error message
  PIX_EDU_FORMATION_INITIALE_2ND_DEGRE_INITIE,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'PIX_EDU_FO... Remove this comment to see the full error message
  PIX_EDU_FORMATION_INITIALE_2ND_DEGRE_CONFIRME,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'PIX_EDU_FO... Remove this comment to see the full error message
  PIX_EDU_FORMATION_CONTINUE_2ND_DEGRE_CONFIRME,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'PIX_EDU_FO... Remove this comment to see the full error message
  PIX_EDU_FORMATION_CONTINUE_2ND_DEGRE_AVANCE,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'PIX_EDU_FO... Remove this comment to see the full error message
  PIX_EDU_FORMATION_CONTINUE_2ND_DEGRE_EXPERT,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'PIX_EDU_FO... Remove this comment to see the full error message
  PIX_EDU_FORMATION_INITIALE_1ER_DEGRE_INITIE,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'PIX_EDU_FO... Remove this comment to see the full error message
  PIX_EDU_FORMATION_INITIALE_1ER_DEGRE_CONFIRME,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'PIX_EDU_FO... Remove this comment to see the full error message
  PIX_EDU_FORMATION_CONTINUE_1ER_DEGRE_CONFIRME,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'PIX_EDU_FO... Remove this comment to see the full error message
  PIX_EDU_FORMATION_CONTINUE_1ER_DEGRE_AVANCE,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'PIX_EDU_FO... Remove this comment to see the full error message
  PIX_EDU_FORMATION_CONTINUE_1ER_DEGRE_EXPERT,
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
} = require('../../../../lib/domain/models/Badge').keys;

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Domain | Models | BadgeAcquisition', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#get badgeKey', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return the key of the related badge', function () {
      // given
      const badge = domainBuilder.buildBadge({ id: 123, key: 'someKey' });
      const badgeAcquisition = domainBuilder.buildBadgeAcquisition({ badge, badgeId: 123 });

      // when
      const badgeKey = badgeAcquisition.badgeKey;

      // then
      expect(badgeKey).to.equal('someKey');
    });
  });

  // eslint-disable-next-line mocha/no-setup-in-describe
  [
    {
      methodName: 'isPixDroit',
      keys: [PIX_DROIT_MAITRE_CERTIF, PIX_DROIT_EXPERT_CERTIF],
    },
    {
      methodName: 'isPixEdu1erDegre',
      keys: [
        PIX_EDU_FORMATION_INITIALE_1ER_DEGRE_INITIE,
        PIX_EDU_FORMATION_INITIALE_1ER_DEGRE_CONFIRME,
        PIX_EDU_FORMATION_CONTINUE_1ER_DEGRE_CONFIRME,
        PIX_EDU_FORMATION_CONTINUE_1ER_DEGRE_AVANCE,
        PIX_EDU_FORMATION_CONTINUE_1ER_DEGRE_EXPERT,
      ],
    },
    {
      methodName: 'isPixEdu2ndDegre',
      keys: [
        PIX_EDU_FORMATION_INITIALE_2ND_DEGRE_INITIE,
        PIX_EDU_FORMATION_INITIALE_2ND_DEGRE_CONFIRME,
        PIX_EDU_FORMATION_CONTINUE_2ND_DEGRE_CONFIRME,
        PIX_EDU_FORMATION_CONTINUE_2ND_DEGRE_AVANCE,
        PIX_EDU_FORMATION_CONTINUE_2ND_DEGRE_EXPERT,
      ],
    },
    {
      methodName: 'isClea',
      keys: [PIX_EMPLOI_CLEA_V1, PIX_EMPLOI_CLEA_V2, PIX_EMPLOI_CLEA_V3],
    },
  ].forEach(({ methodName, keys }) => {
    // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
    describe(`#${methodName}`, function () {
      // eslint-disable-next-line mocha/no-setup-in-describe
      keys.forEach((badgeKey) => {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it(`should return true for badge ${badgeKey}`, function () {
          // given
          const badgeAcquisition = domainBuilder.buildBadgeAcquisition({
            badge: domainBuilder.buildBadge({ key: badgeKey }),
          });

          // when
          const isIt = badgeAcquisition[methodName]();

          // then
          expect(isIt).to.be.true;
        });
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return false otherwise', function () {
        // given
        const badgeAcquisition = domainBuilder.buildBadgeAcquisition({
          badge: domainBuilder.buildBadge({ key: 'IT_S_NOT' }),
        });

        // when
        const isIt = badgeAcquisition[methodName]();

        // then
        expect(isIt).to.be.false;
      });
    });
  });
});
