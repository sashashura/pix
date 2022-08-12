// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect } = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'ObjectVali... Remove this comment to see the full error message
const { ObjectValidationError } = require('../../../../lib/domain/errors');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Authentica... Remove this comment to see the full error message
const AuthenticationMethod = require('../../../../lib/domain/models/AuthenticationMethod');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Domain | Models | AuthenticationMethod', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('buildPixAuthenticationMethod', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should build PixAuthenticationMethod', function () {
      // given
      const id = 1;
      const userId = 1;
      const password = 'foo';
      const shouldChangePassword = true;
      const createdAt = Date.now();
      const updatedAt = Date.now();

      // when
      const result = AuthenticationMethod.buildPixAuthenticationMethod({
        id,
        password,
        shouldChangePassword,
        createdAt,
        updatedAt,
        userId,
      });

      // then
      const authenticationComplement = new AuthenticationMethod.PixAuthenticationComplement({
        password,
        shouldChangePassword,
      });

      const expectedResult = {
        id,
        identityProvider: AuthenticationMethod.identityProviders.PIX,
        authenticationComplement,
        externalIdentifier: undefined,
        userId,
        createdAt,
        updatedAt,
      };
      expect(result).to.deep.equal(expectedResult);
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('constructor', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should successfully instantiate object when identityProvider is GAR and externalIdentifier is defined', function () {
      // when
      expect(
        () =>
          new AuthenticationMethod({
            identityProvider: AuthenticationMethod.identityProviders.GAR,
            externalIdentifier: 'externalIdentifier',
            userId: 1,
          })
      ).not.to.throw(ObjectValidationError);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should successfully instantiate object when identityProvider is POLE_EMPLOI and externalIdentifier and authenticationComplements are defined', function () {
      // given
      const authenticationComplement = new AuthenticationMethod.OidcAuthenticationComplement({
        accessToken: 'accessToken',
        refreshToken: 'refreshToken',
        expiredDate: Date.now(),
      });
      // when
      expect(
        () =>
          new AuthenticationMethod({
            identityProvider: AuthenticationMethod.identityProviders.POLE_EMPLOI,
            externalIdentifier: 'externalIdentifier',
            authenticationComplement,
            userId: 1,
          })
      ).not.to.throw(ObjectValidationError);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should successfully instantiate object when identityProvider is CNAV and externalIdentifier is defined', function () {
      // given & when & then
      expect(
        () =>
          new AuthenticationMethod({
            identityProvider: AuthenticationMethod.identityProviders.CNAV,
            externalIdentifier: 'externalIdentifier',
            userId: 1,
          })
      ).not.to.throw(ObjectValidationError);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should throw an ObjectValidationError when identityProvider is not valid', function () {
      // when
      expect(
        () =>
          new AuthenticationMethod({
            identityProvider: 'not_valid',
            externalIdentifier: 'externalIdentifier',
            userId: 1,
          })
      ).to.throw(ObjectValidationError);
      expect(
        () =>
          new AuthenticationMethod({ identityProvider: undefined, externalIdentifier: 'externalIdentifier', userId: 1 })
      ).to.throw(ObjectValidationError);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should throw an ObjectValidationError when externalIdentifier is not defined for identityProvider GAR, POLE_EMPLOI or CNAV', function () {
      // when
      expect(
        () =>
          new AuthenticationMethod({
            identityProvider: AuthenticationMethod.identityProviders.GAR,
            externalIdentifier: undefined,
            userId: 1,
          })
      ).to.throw(ObjectValidationError);
      expect(
        () =>
          new AuthenticationMethod({
            identityProvider: AuthenticationMethod.identityProviders.POLE_EMPLOI,
            externalIdentifier: undefined,
            userId: 1,
          })
      ).to.throw(ObjectValidationError);
      expect(
        () =>
          new AuthenticationMethod({
            identityProvider: AuthenticationMethod.identityProviders.CNAV,
            externalIdentifier: undefined,
            userId: 1,
          })
      ).to.throw(ObjectValidationError);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should throw an ObjectValidationError when authenticationComplement is not defined for identityProvider PIX', function () {
      // when
      expect(
        () =>
          new AuthenticationMethod({
            identityProvider: AuthenticationMethod.identityProviders.PIX,
            authenticationComplement: undefined,
            userId: 1,
          })
      ).to.throw(ObjectValidationError);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should throw an ObjectValidationError when userId is not valid', function () {
      // when
      expect(
        () =>
          new AuthenticationMethod({
            identityProvider: AuthenticationMethod.identityProviders.GAR,
            externalIdentifier: 'externalIdentifier',
            userId: 'not_valid',
          })
      ).to.throw(ObjectValidationError);
      expect(
        () =>
          new AuthenticationMethod({
            identityProvider: AuthenticationMethod.identityProviders.GAR,
            externalIdentifier: 'externalIdentifier',
            userId: undefined,
          })
      ).to.throw(ObjectValidationError);
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('PixAuthenticationComplement', function () {
      let validArguments: $TSFixMe;
      // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
      beforeEach(function () {
        validArguments = {
          password: 'Password123',
          shouldChangePassword: false,
        };
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should successfully instantiate object when passing all valid arguments', function () {
        // when
        expect(() => new AuthenticationMethod.PixAuthenticationComplement(validArguments)).not.to.throw(
          ObjectValidationError
        );
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should throw an ObjectValidationError when password is not valid', function () {
        // when
        expect(
          () => new AuthenticationMethod.PixAuthenticationComplement({ ...validArguments, password: 1234 })
        ).to.throw(ObjectValidationError);
        expect(
          () => new AuthenticationMethod.PixAuthenticationComplement({ ...validArguments, password: undefined })
        ).to.throw(ObjectValidationError);
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should throw an ObjectValidationError when shouldChangePassword is not valid', function () {
        // when
        expect(
          () =>
            new AuthenticationMethod.PixAuthenticationComplement({
              ...validArguments,
              shouldChangePassword: 'not_valid',
            })
        ).to.throw(ObjectValidationError);
        expect(
          () =>
            new AuthenticationMethod.PixAuthenticationComplement({ ...validArguments, shouldChangePassword: undefined })
        ).to.throw(ObjectValidationError);
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('OidcAuthenticationComplement', function () {
      let validArguments: $TSFixMe;
      // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
      beforeEach(function () {
        validArguments = {
          accessToken: 'accessToken',
          refreshToken: 'refreshToken',
          expiredDate: Date.now(),
        };
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should successfully instantiate object when passing all valid arguments', function () {
        // when
        expect(() => new AuthenticationMethod.OidcAuthenticationComplement(validArguments)).not.to.throw(
          ObjectValidationError
        );
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should throw an ObjectValidationError when accessToken is not valid', function () {
        // when
        expect(
          () => new AuthenticationMethod.OidcAuthenticationComplement({ ...validArguments, accessToken: 1234 })
        ).to.throw(ObjectValidationError);
        expect(
          () => new AuthenticationMethod.OidcAuthenticationComplement({ ...validArguments, accessToken: undefined })
        ).to.throw(ObjectValidationError);
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should throw an ObjectValidationError when refreshToken is not valid', function () {
        // when
        expect(
          () => new AuthenticationMethod.OidcAuthenticationComplement({ ...validArguments, refreshToken: 1234 })
        ).to.throw(ObjectValidationError);
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should throw an ObjectValidationError when expiredDate is not valid', function () {
        // when
        expect(
          () => new AuthenticationMethod.OidcAuthenticationComplement({ ...validArguments, expiredDate: 'not_valid' })
        ).to.throw(ObjectValidationError);
        expect(
          () => new AuthenticationMethod.OidcAuthenticationComplement({ ...validArguments, expiredDate: undefined })
        ).to.throw(ObjectValidationError);
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('GARAuthenticationComplement', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should successfully instantiate object when passing all valid arguments', function () {
        expect(
          () =>
            new AuthenticationMethod.GARAuthenticationComplement({
              firstName: 'Margaret',
              lastName: 'Remington',
            })
        ).not.to.throw(ObjectValidationError);
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should throw an ObjectValidationError when firstName is not a string', function () {
        expect(
          () =>
            new AuthenticationMethod.GARAuthenticationComplement({
              lastName: 'Remington',
              firstName: 1234,
            })
        ).to.throw(ObjectValidationError);
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should throw an ObjectValidationError when firstName is missing', function () {
        expect(
          () =>
            new AuthenticationMethod.GARAuthenticationComplement({
              lastName: 'Remington',
            })
        ).to.throw(ObjectValidationError);
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should throw an ObjectValidationError when lastName is not a string', function () {
        expect(
          () =>
            new AuthenticationMethod.GARAuthenticationComplement({
              firstName: 'Margaret',
              lastName: 4567,
            })
        ).to.throw(ObjectValidationError);
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should throw an ObjectValidationError when lastName is missing', function () {
        expect(
          () =>
            new AuthenticationMethod.GARAuthenticationComplement({
              firstName: 'Margaret',
            })
        ).to.throw(ObjectValidationError);
      });
    });
  });
});
