// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'omit'.
const omit = require('lodash/omit');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'jsonwebtok... Remove this comment to see the full error message
const jsonwebtoken = require('jsonwebtoken');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'catchErr'.
const { catchErr, expect, sinon } = require('../../../test-helper');

const {
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'InvalidTem... Remove this comment to see the full error message
  InvalidTemporaryKeyError,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'InvalidExt... Remove this comment to see the full error message
  InvalidExternalUserTokenError,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'InvalidRes... Remove this comment to see the full error message
  InvalidResultRecipientTokenError,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'InvalidSes... Remove this comment to see the full error message
  InvalidSessionResultError,
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
} = require('../../../../lib/domain/errors');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'settings'.
const settings = require('../../../../lib/config');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'tokenServi... Remove this comment to see the full error message
const tokenService = require('../../../../lib/domain/services/token-service');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Domain | Service | Token Service', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#createAccessTokenFromUser', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should create access token with user id and source', function () {
      // given
      const userId = 123;
      const source = 'pix';
      settings.authentication.secret = 'a secret';
      settings.authentication.accessTokenLifespanMs = 1000;
      const accessToken = 'valid access token';
      const expirationDelaySeconds = 1;
      const firstParameter = { user_id: userId, source };
      const secondParameter = 'a secret';
      const thirdParameter = { expiresIn: 1 };
      sinon.stub(jsonwebtoken, 'sign').withArgs(firstParameter, secondParameter, thirdParameter).returns(accessToken);

      // when
      const result = tokenService.createAccessTokenFromUser(userId, source);

      // then
      expect(result).to.be.deep.equal({ accessToken, expirationDelaySeconds });
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#createIdTokenForUserReconciliation', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return a valid idToken with firstName, lastName, samlId', function () {
      // given
      const externalUser = {
        firstName: 'Adèle',
        lastName: 'Lopez',
        samlId: 'IDO-for-adele',
      };
      const expectedTokenAttributes = {
        first_name: 'Adèle',
        last_name: 'Lopez',
        saml_id: 'IDO-for-adele',
      };

      // when
      const idToken = tokenService.createIdTokenForUserReconciliation(externalUser);

      // then
      const decodedToken = jsonwebtoken.verify(idToken, settings.authentication.secret);
      expect(omit(decodedToken, ['iat', 'exp'])).to.deep.equal(expectedTokenAttributes);
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#extractExternalUserFromIdToken', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return external user if the idToken is valid', async function () {
      // given
      const externalUser = {
        firstName: 'Saml',
        lastName: 'Jackson',
        samlId: 'SamlId',
      };

      const idToken = tokenService.createIdTokenForUserReconciliation(externalUser);

      // when
      const result = await tokenService.extractExternalUserFromIdToken(idToken);

      // then
      expect(result).to.deep.equal(externalUser);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should throw an InvalidExternalUserTokenError if the idToken is invalid', async function () {
      // given
      const idToken = 'WRONG_DATA';

      // when
      // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
      const error = await catchErr(tokenService.extractExternalUserFromIdToken)(idToken);
      expect(error).to.be.an.instanceof(InvalidExternalUserTokenError);
      expect((error as $TSFixMe).message).to.be.equal('Une erreur est survenue. Veuillez réessayer de vous connecter depuis le médiacentre.');
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#extractUserId', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return userId if the accessToken is valid', function () {
      // given
      const userId = 123;
      const accessToken = tokenService.createAccessTokenFromUser(userId, 'pix').accessToken;

      // when
      const result = tokenService.extractUserId(accessToken);

      // then
      expect(result).to.equal(123);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return null if the accessToken is invalid', function () {
      // given
      const accessToken = 'WRONG_DATA';

      // when
      const result = tokenService.extractUserId(accessToken);

      // then
      expect(result).to.equal(null);
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#extractUserIdForCampaignResults', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return userId if the accessToken is valid', function () {
      // given
      const userId = 123;
      const accessToken = tokenService.createTokenForCampaignResults(userId);

      // when
      const result = tokenService.extractUserIdForCampaignResults(accessToken);

      // then
      expect(result).to.equal(userId);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return null if the accessToken is invalid', function () {
      // given
      const accessToken = 'WRONG_DATA';

      // when
      const result = tokenService.extractUserIdForCampaignResults(accessToken);

      // then
      expect(result).to.equal(null);
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#decodeIfValid', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should throw an Invalid token error, when token is not valid', async function () {
      // given
      const token =
        'eyJhbGciOiJIUzI1NiIsIgR5cCI6IkpXVCJ9.eyJ1c2VyX2lPIjoxMjMsImlhdCI6MTQ5OTA3Nzg2Mn0.FRAAoowTA8Bc6BOzD7wWh2viVN47VrPcGgLuHi_NmKw';

      // when
      // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
      const error = await catchErr(tokenService.decodeIfValid)(token);

      // then
      expect(error).to.be.an.instanceof(InvalidTemporaryKeyError);
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#extractSamlId', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return samlId if the idToken is valid', function () {
      // given
      const expectedSamlId = 'SAMLID';
      const userAttributes = {
        firstName: 'firstName',
        lastName: 'lastName',
        samlId: expectedSamlId,
      };
      const idToken = tokenService.createIdTokenForUserReconciliation(userAttributes);

      // when
      const samlId = tokenService.extractSamlId(idToken);

      // then
      expect(samlId).to.equal(expectedSamlId);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return null if the idToken is invalid', function () {
      // given
      const invalidIdToken = 'ABCD';

      // when
      const result = tokenService.extractSamlId(invalidIdToken);

      // then
      expect(result).to.equal(null);
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#extractSessionId', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return the session id if the token is valid', function () {
      // given
      const token = jsonwebtoken.sign(
        {
          session_id: 12345,
        },
        settings.authentication.secret,
        { expiresIn: '30d' }
      );

      // when
      const tokenData = tokenService.extractSessionId(token);

      // then
      expect(tokenData).to.deep.equal({
        sessionId: 12345,
      });
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should throw if session id or result recipient email is missing', async function () {
      // given
      const invalidIdToken = jsonwebtoken.sign({}, settings.authentication.secret, { expiresIn: '30d' });

      // when
      // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
      const error = await catchErr(tokenService.extractSessionId)(invalidIdToken);

      // then
      expect(error).to.be.an.instanceof(InvalidSessionResultError);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should throw if token is expired', async function () {
      // given
      const invalidIdToken = jsonwebtoken.sign(
        {
          session_id: 1234,
        },
        settings.authentication.secret,
        { expiresIn: '1' }
      );

      // when
      // @ts-expect-error TS(2304): Cannot find name 'setTimeout'.
      setTimeout(async () => {
        return;
      }, 100);
      // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
      const error = await catchErr(tokenService.extractSessionId)(invalidIdToken);

      // then
      expect(error).to.be.an.instanceof(InvalidSessionResultError);
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#extractResultRecipientEmailAndSessionId', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return the session id and result recipient email if the token is valid', function () {
      // given
      const token = jsonwebtoken.sign(
        {
          result_recipient_email: 'recipientEmail@example.net',
          session_id: 12345,
        },
        settings.authentication.secret,
        { expiresIn: '30d' }
      );

      // when
      const tokenData = tokenService.extractResultRecipientEmailAndSessionId(token);

      // then
      expect(tokenData).to.deep.equal({
        resultRecipientEmail: 'recipientEmail@example.net',
        sessionId: 12345,
      });
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should throw if session id or result recipient email is missing', async function () {
      // given
      const invalidIdToken = jsonwebtoken.sign(
        {
          result_recipient_email: 'recipientEmail@example.net',
        },
        settings.authentication.secret,
        { expiresIn: '30d' }
      );

      // when
      // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
      const error = await catchErr(tokenService.extractResultRecipientEmailAndSessionId)(invalidIdToken);

      // then
      expect(error).to.be.an.instanceof(InvalidResultRecipientTokenError);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should throw if token is expired', async function () {
      // given
      const invalidIdToken = jsonwebtoken.sign(
        {
          result_recipient_email: 'recipientEmail@example.net',
          session_id: 1234,
        },
        settings.authentication.secret,
        { expiresIn: '1' }
      );

      // when
      // @ts-expect-error TS(2304): Cannot find name 'setTimeout'.
      setTimeout(async () => {
        return;
      }, 100);
      // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
      const error = await catchErr(tokenService.extractResultRecipientEmailAndSessionId)(invalidIdToken);

      // then
      expect(error).to.be.an.instanceof(InvalidResultRecipientTokenError);
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#createCertificationResultsByRecipientEmailLinkToken', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return a valid token with sessionId and resultRecipientEmail', function () {
      // given
      const sessionId = 'abcd1234';
      const resultRecipientEmail = 'results@college-romain-rolland.edu';
      const daysBeforeExpiration = 30;
      const expectedTokenAttributes = {
        session_id: 'abcd1234',
        result_recipient_email: 'results@college-romain-rolland.edu',
      };

      // when
      const linkToken = tokenService.createCertificationResultsByRecipientEmailLinkToken({
        sessionId,
        resultRecipientEmail,
        daysBeforeExpiration,
      });

      // then
      const decodedToken = jsonwebtoken.verify(linkToken, settings.authentication.secret);
      expect(omit(decodedToken, ['iat', 'exp'])).to.deep.equal(expectedTokenAttributes);
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#createCertificationResultsLinkToken', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return a valid token with sessionId and resultRecipientEmail', function () {
      // given
      const sessionId = 'abcd1234';
      const daysBeforeExpiration = 30;
      const expectedTokenAttributes = {
        session_id: 'abcd1234',
      };

      // when
      const linkToken = tokenService.createCertificationResultsLinkToken({ sessionId, daysBeforeExpiration });

      // then
      const decodedToken = jsonwebtoken.verify(linkToken, settings.authentication.secret);
      expect(omit(decodedToken, ['iat', 'exp'])).to.deep.equal(expectedTokenAttributes);
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#createPasswordResetToken', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return a valid token with userId', function () {
      // given
      const userId = 1;

      // when
      const token = tokenService.createPasswordResetToken(userId);

      // then
      const decodedToken = jsonwebtoken.verify(token, settings.authentication.secret);
      expect(omit(decodedToken, ['iat', 'exp'])).to.deep.equal({ user_id: userId });
    });
  });
});
