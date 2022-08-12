/* eslint-disable mocha/no-setup-in-describe */
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect } = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'categories... Remove this comment to see the full error message
const categories = require('../../../../lib/domain/constants/organization-places-categories');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Organizati... Remove this comment to see the full error message
const OrganizationPlacesLot = require('../../../../lib/domain/models/OrganizationPlacesLot');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'EntityVali... Remove this comment to see the full error message
const { EntityValidationError } = require('../../../../lib/domain/errors');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Domain | Models | OrganizationPlaces', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#constructor', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should create an organizationPlacesLot with correct attributes', function () {
      //given
      const attributes = {
        organizationId: 1,
        count: 10,
        activationDate: '2022-01-02',
        expirationDate: '2023-01-02',
        reference: 'abc123',
        category: categories.FREE_RATE,
        createdBy: 888,
      };

      //when
      const organizationPlacesLot = new OrganizationPlacesLot(attributes);

      //then
      expect(organizationPlacesLot.organizationId).to.equal(1);
      expect(organizationPlacesLot.count).to.equal(10);
      expect(organizationPlacesLot.activationDate).to.equal('2022-01-02');
      expect(organizationPlacesLot.expirationDate).to.equal('2023-01-02');
      expect(organizationPlacesLot.reference).to.equal('abc123');
      expect(organizationPlacesLot.category).to.equal(categories.T0);
      expect(organizationPlacesLot.createdBy).to.equal(888);
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('#validation', function () {
      let initialAttributes: $TSFixMe;
      // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
      beforeEach(function () {
        initialAttributes = {
          organizationId: 1,
          count: 10,
          activationDate: '2022-01-02',
          expirationDate: '2023-01-02',
          reference: 'abc123',
          category: categories.FREE_RATE,
          createdBy: 123,
        };
      });

      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('#organizationId', function () {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('it should throw an exception when organizationId is missing', function () {
          //given
          const attributes = {
            ...initialAttributes,
            organizationId: undefined,
          };

          //when
          let error;
          try {
            new OrganizationPlacesLot(attributes);
          } catch (e) {
            error = e;
          }
          //then
          expect(error).to.be.instanceOf(EntityValidationError);
          expect((error as $TSFixMe).invalidAttributes).to.deep.equals([
    {
        attribute: 'organizationId',
        message: `L'organisationId est obligatoire.`,
    },
]);
        });

        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('it should throw an exception when organizationId is not a number', function () {
          //given
          const attributes = {
            ...initialAttributes,
            organizationId: 'toto',
          };

          //when
          let error;
          try {
            new OrganizationPlacesLot(attributes);
          } catch (e) {
            error = e;
          }
          //then
          expect(error).to.be.instanceOf(EntityValidationError);
          expect((error as $TSFixMe).invalidAttributes).to.deep.equals([
    {
        attribute: 'organizationId',
        message: `L'identifiant de l'organisation doit être un nombre.`,
    },
]);
        });
      });

      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('#count', function () {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('it should throw an exception when count is not a number', function () {
          //given
          const attributes = {
            ...initialAttributes,
            count: 'toto',
          };

          //when
          let error;
          try {
            new OrganizationPlacesLot(attributes);
          } catch (e) {
            error = e;
          }
          //then
          expect(error).to.be.instanceOf(EntityValidationError);
          expect((error as $TSFixMe).invalidAttributes).to.deep.equals([
    {
        attribute: 'count',
        message: 'Le nombre de places doit être un nombre sans virgule supérieur à 0.',
    },
]);
        });

        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('it should throw an exception when count is not a positive number', function () {
          //given
          const attributes = {
            ...initialAttributes,
            count: -1,
          };

          //when
          let error;
          try {
            new OrganizationPlacesLot(attributes);
          } catch (e) {
            error = e;
          }
          //then
          expect(error).to.be.instanceOf(EntityValidationError);
          expect((error as $TSFixMe).invalidAttributes).to.deep.equals([
    {
        attribute: 'count',
        message: 'Le nombre de places doit être un nombre sans virgule supérieur à 0.',
    },
]);
        });

        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('it should throw an exception when count is not an integer', function () {
          //given
          const attributes = {
            ...initialAttributes,
            count: '2.5',
          };

          //when
          let error;
          try {
            new OrganizationPlacesLot(attributes);
          } catch (e) {
            error = e;
          }
          //then
          expect(error).to.be.instanceOf(EntityValidationError);
          expect((error as $TSFixMe).invalidAttributes).to.deep.equals([
    {
        attribute: 'count',
        message: 'Le nombre de places doit être un nombre sans virgule supérieur à 0.',
    },
]);
        });

        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('it should throw an exception when count is set to 0', function () {
          //given
          const attributes = {
            ...initialAttributes,
            count: '0',
          };

          //when
          let error;
          try {
            new OrganizationPlacesLot(attributes);
          } catch (e) {
            error = e;
          }
          //then
          expect(error).to.be.instanceOf(EntityValidationError);
          expect((error as $TSFixMe).invalidAttributes).to.deep.equals([
    {
        attribute: 'count',
        message: 'Le nombre de places doit être un nombre sans virgule supérieur à 0.',
    },
]);
        });
      });

      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('#activationDate', function () {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('it should throw an exception when activationDate has not the correct format', function () {
          //given
          const attributes = {
            ...initialAttributes,
            activationDate: '10-10-2022',
          };

          //when
          let error;
          try {
            new OrganizationPlacesLot(attributes);
          } catch (e) {
            error = e;
          }

          //then
          expect(error).to.be.instanceOf(EntityValidationError);
          expect((error as $TSFixMe).invalidAttributes).to.deep.equals([
    {
        attribute: 'activationDate',
        message: `Le format de La date n'est pas correct.`,
    },
]);
        });

        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('it should throw an exception when activationDate is missing', function () {
          //given
          const attributes = {
            ...initialAttributes,
            activationDate: undefined,
            expirationDate: undefined,
          };

          //when
          let error;
          try {
            new OrganizationPlacesLot(attributes);
          } catch (e) {
            error = e;
          }

          //then
          expect(error).to.be.instanceOf(EntityValidationError);
          expect((error as $TSFixMe).invalidAttributes).to.deep.equals([
    {
        attribute: 'activationDate',
        message: `La date d'activation est obligatoire.`,
    },
]);
        });
      });

      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('#expirationDate', function () {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('it should throw an exception when expirationDate has not the correct format', function () {
          //given
          const attributes = {
            ...initialAttributes,
            activationDate: '2022-01-10',
            expirationDate: '10-01-2022',
          };

          //when
          let error;
          try {
            new OrganizationPlacesLot(attributes);
          } catch (e) {
            error = e;
          }

          //then
          expect(error).to.be.instanceOf(EntityValidationError);
          expect((error as $TSFixMe).invalidAttributes).to.deep.equals([
    {
        attribute: 'expirationDate',
        message: `Le format de La date n'est pas correct.`,
    },
]);
        });

        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('it should throw an exception when expirationDate = activationDate', function () {
          //given
          const attributes = {
            ...initialAttributes,
            activationDate: '2022-01-21',
            expirationDate: '2022-01-21',
          };

          //when
          let error;
          try {
            new OrganizationPlacesLot(attributes);
          } catch (e) {
            error = e;
          }
          //then
          expect(error).to.be.instanceOf(EntityValidationError);
          expect((error as $TSFixMe).invalidAttributes).to.deep.equals([
    {
        attribute: 'expirationDate',
        message: `La date d'expiration doit être supérieur à la date d'activation.`,
    },
]);
        });

        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('it should throw an exception when expirationDate < activationDate', function () {
          //given
          const attributes = {
            ...initialAttributes,
            activationDate: '2022-01-21',
            expirationDate: '2021-01-21',
          };

          //when
          let error;
          try {
            new OrganizationPlacesLot(attributes);
          } catch (e) {
            error = e;
          }
          //then
          expect(error).to.be.instanceOf(EntityValidationError);
          expect((error as $TSFixMe).invalidAttributes).to.deep.equals([
    {
        attribute: 'expirationDate',
        message: `La date d'expiration doit être supérieur à la date d'activation.`,
    },
]);
        });
      });

      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('#reference', function () {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('it should throw an exception when reference is undefined', function () {
          //given
          const attributes = {
            ...initialAttributes,
            reference: undefined,
          };

          //when
          let error;
          try {
            new OrganizationPlacesLot(attributes);
          } catch (e) {
            error = e;
          }
          //then
          expect(error).to.be.instanceOf(EntityValidationError);
          expect((error as $TSFixMe).invalidAttributes).to.deep.equals([
    {
        attribute: 'reference',
        message: 'La référence est obligatoire.',
    },
]);
        });

        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('it should throw an exception when reference is empty', function () {
          //given
          const attributes = {
            ...initialAttributes,
            reference: '',
          };

          //when
          let error;
          try {
            new OrganizationPlacesLot(attributes);
          } catch (e) {
            error = e;
          }
          //then
          expect(error).to.be.instanceOf(EntityValidationError);
          expect((error as $TSFixMe).invalidAttributes).to.deep.equals([
    {
        attribute: 'reference',
        message: 'La référence est obligatoire.',
    },
]);
        });

        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('it should throw an exception when reference is not a string', function () {
          //given
          const attributes = {
            ...initialAttributes,
            reference: 123,
          };

          //when
          let error;
          try {
            new OrganizationPlacesLot(attributes);
          } catch (e) {
            error = e;
          }
          //then
          expect(error).to.be.instanceOf(EntityValidationError);
          expect((error as $TSFixMe).invalidAttributes).to.deep.equals([
    {
        attribute: 'reference',
        message: 'La référence est obligatoire.',
    },
]);
        });
      });

      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('#category', function () {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('it should throw an exception when category is missing', function () {
          //given
          const attributes = {
            ...initialAttributes,
            category: undefined,
          };

          //when
          let error;
          try {
            new OrganizationPlacesLot(attributes);
          } catch (e) {
            error = e;
          }

          //then
          expect(error).to.be.instanceOf(EntityValidationError);
          expect((error as $TSFixMe).invalidAttributes).to.deep.equals([
    {
        attribute: 'category',
        message: `La catégorie est obligatoire.`,
    },
]);
        });
        [
          { code: categories.T0, category: categories.FREE_RATE },
          { code: categories.T1, category: categories.PUBLIC_RATE },
          { code: categories.T2, category: categories.REDUCE_RATE },
          { code: categories.T2bis, category: categories.SPECIAL_REDUCE_RATE },
          { code: categories.T3, category: categories.FULL_RATE },
        ].forEach((data) => {
          // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
          it(`it returns ${data.code} when category is ${data.category}`, function () {
            //given
            const attributes = {
              ...initialAttributes,
              category: data.category,
            };
            //when
            const organizationPlaces = new OrganizationPlacesLot(attributes);

            expect(organizationPlaces.category).to.equal(data.code);
          });
        });
      });

      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('#createdBy', function () {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('it should throw an exception when createdBy is missing', function () {
          //given
          const attributes = {
            ...initialAttributes,
            createdBy: undefined,
          };

          //when
          let error;
          try {
            new OrganizationPlacesLot(attributes);
          } catch (e) {
            error = e;
          }

          //then
          expect(error).to.be.instanceOf(EntityValidationError);
          expect((error as $TSFixMe).invalidAttributes).to.deep.equals([
    {
        attribute: 'createdBy',
        message: 'Le créateur est obligatoire.',
    },
]);
        });
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('it should throw an exception when createdBy is not an a number', function () {
          //given
          const attributes = {
            ...initialAttributes,
            createdBy: 'abc',
          };

          //when
          let error;
          try {
            new OrganizationPlacesLot(attributes);
          } catch (e) {
            error = e;
          }

          //then
          expect(error).to.be.instanceOf(EntityValidationError);
          expect((error as $TSFixMe).invalidAttributes).to.deep.equals([
    {
        attribute: 'createdBy',
        message: '"createdBy" must be a number',
    },
]);
        });
      });
    });
  });
});
/* eslint-enable mocha/no-setup-in-describe */
