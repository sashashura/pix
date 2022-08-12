// @ts-expect-error TS(6200): Definitions of the following identifiers conflict ... Remove this comment to see the full error message
const { expect, hFake, sinon } = require('../../test-helper');

const {
  AccountRecoveryDemandExpired,
  AdminMemberError,
  AlreadyRegisteredEmailAndUsernameError,
  AlreadyRegisteredEmailError,
  AlreadyRegisteredUsernameError,
  AuthenticationKeyExpired,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'EntityVali... Remove this comment to see the full error message
  EntityValidationError,
  InvalidExternalAPIResponseError,
  MissingOrInvalidCredentialsError,
  UnexpectedUserAccountError,
  UserShouldChangePasswordError,
  MultipleOrganizationLearnersWithDifferentNationalStudentIdError,
  UserHasAlreadyLeftSCO,
  OrganizationLearnerAlreadyLinkedToInvalidUserError,
  InvalidVerificationCodeError,
  EmailModificationDemandNotFoundOrExpiredError,
  CandidateNotAuthorizedToJoinSessionError,
  CandidateNotAuthorizedToResumeCertificationTestError,
  UncancellableOrganizationInvitationError,
  OrganizationLearnerCannotBeDissociatedError,
  UserShouldNotBeReconciledOnAnotherAccountError,
  CertificationCandidateOnFinalizedSessionError,
  CertificationEndedByFinalizationError,
  SessionStartedDeletionError,
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
} = require('../../../lib/domain/errors');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'HttpErrors... Remove this comment to see the full error message
const HttpErrors = require('../../../lib/application/http-errors.js');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'handle'.
const { handle } = require('../../../lib/application/error-manager');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Application | ErrorManager', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#handle', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should translate EntityValidationError', async function () {
      // given
      const request = {
        headers: {
          'accept-language': 'en',
        },
      };
      const error = new EntityValidationError({
        invalidAttributes: [{ attribute: 'name', message: 'STAGE_TITLE_IS_REQUIRED' }],
      });

      // when
      const response = await handle(request, hFake, error);

      // then
      expect(response.statusCode).to.equal(422);
      expect(response.source).to.deep.equal({
        errors: [
          {
            detail: 'The title is required',
            source: {
              pointer: '/data/attributes/name',
            },
            status: '422',
            title: 'Invalid data attribute "name"',
          },
        ],
      });
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should translate EntityValidationError to french', async function () {
      // given
      const request = {
        headers: {
          'accept-language': 'fr-fr',
        },
      };
      const error = new EntityValidationError({
        invalidAttributes: [{ attribute: 'name', message: 'STAGE_TITLE_IS_REQUIRED' }],
      });

      // when
      const response = await handle(request, hFake, error);

      // then
      expect(response.statusCode).to.equal(422);
      expect(response.source).to.deep.equal({
        errors: [
          {
            detail: 'Le titre du palier est obligatoire',
            source: {
              pointer: '/data/attributes/name',
            },
            status: '422',
            title: 'Invalid data attribute "name"',
          },
        ],
      });
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should fallback to the message if the translation is not found', async function () {
      // given
      const request = {
        headers: {
          'accept-language': 'en',
        },
      };
      const error = new EntityValidationError({
        invalidAttributes: [{ attribute: 'name', message: 'message' }],
      });

      // when
      const response = await handle(request, hFake, error);

      // then
      expect(response.statusCode).to.equal(422);
      expect(response.source).to.deep.equal({
        errors: [
          {
            detail: 'message',
            source: {
              pointer: '/data/attributes/name',
            },
            status: '422',
            title: 'Invalid data attribute "name"',
          },
        ],
      });
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should translate EntityValidationError even if invalidAttributes is undefined', async function () {
      // given
      const request = {
        headers: {
          'accept-language': 'en',
        },
      };
      const error = new EntityValidationError({
        invalidAttributes: undefined,
      });

      // when
      const response = await handle(request, hFake, error);

      // then
      expect(response.statusCode).to.equal(422);
      expect(response.source).to.deep.equal({
        errors: [],
      });
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#_mapToHttpError', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should instantiate UnauthorizedError when MissingOrInvalidCredentialsError', async function () {
      // given
      const error = new MissingOrInvalidCredentialsError();
      sinon.stub(HttpErrors, 'UnauthorizedError');
      const params = { request: {}, h: hFake, error };

      // when
      await handle(params.request, params.h, params.error);

      // then
      const message = "L'adresse e-mail et/ou le mot de passe saisis sont incorrects.";
      expect(HttpErrors.UnauthorizedError).to.have.been.calledWithExactly(message);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should instantiate PasswordShouldChangeError when UserShouldChangePasswordError', async function () {
      // given
      const message = 'Erreur, vous devez changer votre mot de passe.';
      const meta = 'RESET_PASSWORD_TOKEN';
      const error = new UserShouldChangePasswordError(message, meta);
      sinon.stub(HttpErrors, 'PasswordShouldChangeError');
      const params = { request: {}, h: hFake, error };

      // when
      await handle(params.request, params.h, params.error);

      // then
      expect(HttpErrors.PasswordShouldChangeError).to.have.been.calledWithExactly(message, meta);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should instantiate ConflictError when UnexpectedUserAccountError', async function () {
      // given
      const message = undefined;
      const code = 'UNEXPECTED_USER_ACCOUNT';
      const meta = { value: 'j*****@e*****.n**' };
      const error = new UnexpectedUserAccountError({ message, code, meta });
      sinon.stub(HttpErrors, 'ConflictError');
      const params = { request: {}, h: hFake, error };

      // when
      await handle(params.request, params.h, params.error);

      // then
expect(HttpErrors.ConflictError).to.have.been.calledWithExactly((error as $TSFixMe).message, error.code, error.meta);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should instantiate BadRequestError when AlreadyRegisteredEmailError', async function () {
      // given
      const error = new AlreadyRegisteredEmailError();
      sinon.stub(HttpErrors, 'BadRequestError');
      const params = { request: {}, h: hFake, error };

      // when
      await handle(params.request, params.h, params.error);

      // then
expect(HttpErrors.BadRequestError).to.have.been.calledWithExactly((error as $TSFixMe).message, (error as $TSFixMe).code);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should instantiate BadRequestError when AlreadyRegisteredUsernameError', async function () {
      // given
      const error = new AlreadyRegisteredUsernameError();
      sinon.stub(HttpErrors, 'BadRequestError');
      const params = { request: {}, h: hFake, error };

      // when
      await handle(params.request, params.h, params.error);

      // then
expect(HttpErrors.BadRequestError).to.have.been.calledWithExactly((error as $TSFixMe).message);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should instantiate BadRequestError when AlreadyRegisteredEmailAndUsernameError', async function () {
      // given
      const error = new AlreadyRegisteredEmailAndUsernameError();
      sinon.stub(HttpErrors, 'BadRequestError');
      const params = { request: {}, h: hFake, error };

      // when
      await handle(params.request, params.h, params.error);

      // then
expect(HttpErrors.BadRequestError).to.have.been.calledWithExactly((error as $TSFixMe).message);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should instantiate ServiceUnavailableError when InvalidExternalAPIResponseError', async function () {
      // given
      const error = new InvalidExternalAPIResponseError();
      sinon.stub(HttpErrors, 'ServiceUnavailableError');
      const params = { request: {}, h: hFake, error };

      // when
      await handle(params.request, params.h, params.error);

      // then
expect(HttpErrors.ServiceUnavailableError).to.have.been.calledWithExactly((error as $TSFixMe).message);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should instantiate ConflictError when MultipleOrganizationLearnersWithDifferentNationalStudentIdError', async function () {
      // given
      const error = new MultipleOrganizationLearnersWithDifferentNationalStudentIdError();
      sinon.stub(HttpErrors, 'ConflictError');
      const params = { request: {}, h: hFake, error };

      // when
      await handle(params.request, params.h, params.error);

      // then
expect(HttpErrors.ConflictError).to.have.been.calledWithExactly((error as $TSFixMe).message);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should instantiate UnauthorizedError when AccountRecoveryDemandExpired', async function () {
      // given
      const error = new AccountRecoveryDemandExpired();
      sinon.stub(HttpErrors, 'UnauthorizedError');
      const params = { request: {}, h: hFake, error };

      // when
      await handle(params.request, params.h, params.error);

      // then
expect(HttpErrors.UnauthorizedError).to.have.been.calledWithExactly((error as $TSFixMe).message);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should instantiate UnauthorizedError when AuthenticationKeyExpired', async function () {
      // given
      const error = new AuthenticationKeyExpired();
      sinon.stub(HttpErrors, 'UnauthorizedError');
      const params = { request: {}, h: hFake, error };

      // when
      await handle(params.request, params.h, params.error);

      // then
expect(HttpErrors.UnauthorizedError).to.have.been.calledWithExactly((error as $TSFixMe).message);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should instantiate UnauthorizedError when UserHasAlreadyLeftSCO', async function () {
      // given
      const error = new UserHasAlreadyLeftSCO();
      sinon.stub(HttpErrors, 'ForbiddenError');
      const params = { request: {}, h: hFake, error };

      // when
      await handle(params.request, params.h, params.error);

      // then
expect(HttpErrors.ForbiddenError).to.have.been.calledWithExactly((error as $TSFixMe).message);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should instantiate ForbiddenError when InvalidVerificationCodeError', async function () {
      // given
      const error = new InvalidVerificationCodeError();
      sinon.stub(HttpErrors, 'ForbiddenError');
      const params = { request: {}, h: hFake, error };

      // when
      await handle(params.request, params.h, params.error);

      // then
expect(HttpErrors.ForbiddenError).to.have.been.calledWithExactly((error as $TSFixMe).message, (error as $TSFixMe).code);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should instantiate ForbiddenError when EmailModificationDemandNotFoundOrExpiredError', async function () {
      // given
      const error = new EmailModificationDemandNotFoundOrExpiredError();
      sinon.stub(HttpErrors, 'ForbiddenError');
      const params = { request: {}, h: hFake, error };

      // when
      await handle(params.request, params.h, params.error);

      // then
expect(HttpErrors.ForbiddenError).to.have.been.calledWithExactly((error as $TSFixMe).message, (error as $TSFixMe).code);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should instantiate BadRequestError when OrganizationLearnerAlreadyLinkedToInvalidUserError', async function () {
      // given
      const error = new OrganizationLearnerAlreadyLinkedToInvalidUserError();
      sinon.stub(HttpErrors, 'BadRequestError');
      const params = { request: {}, h: hFake, error };

      // when
      await handle(params.request, params.h, params.error);

      // then
expect(HttpErrors.BadRequestError).to.have.been.calledWithExactly((error as $TSFixMe).message);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should instantiate ForbiddenError when CandidateNotAuthorizedToJoinSessionError', async function () {
      // given
      const error = new CandidateNotAuthorizedToJoinSessionError();
      sinon.stub(HttpErrors, 'ForbiddenError');
      const params = { request: {}, h: hFake, error };

      // when
      await handle(params.request, params.h, params.error);

      // then
expect(HttpErrors.ForbiddenError).to.have.been.calledWithExactly((error as $TSFixMe).message, (error as $TSFixMe).code);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should instantiate ForbiddenError when CandidateNotAuthorizedToResumeCertificationTestError', async function () {
      // given
      const error = new CandidateNotAuthorizedToResumeCertificationTestError();
      sinon.stub(HttpErrors, 'ForbiddenError');
      const params = { request: {}, h: hFake, error };

      // when
      await handle(params.request, params.h, params.error);

      // then
expect(HttpErrors.ForbiddenError).to.have.been.calledWithExactly((error as $TSFixMe).message, (error as $TSFixMe).code);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should instantiate UnprocessableEntityError when UncancellableOrganizationInvitationError', async function () {
      // given
      const error = new UncancellableOrganizationInvitationError();
      sinon.stub(HttpErrors, 'UnprocessableEntityError');
      const params = { request: {}, h: hFake, error };

      // when
      await handle(params.request, params.h, params.error);

      // then
expect(HttpErrors.UnprocessableEntityError).to.have.been.calledWithExactly((error as $TSFixMe).message);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should instantiate UnprocessableEntityError when UserShouldNotBeReconciledOnAnotherAccountError', async function () {
      // given
      const code = 'ACCOUNT_SEEMS_TO_BELONGS_TO_ANOTHER_USER';
      const meta = { shortCode: 'R90' };
      const error = new UserShouldNotBeReconciledOnAnotherAccountError({ code, meta });
      sinon.stub(HttpErrors, 'UnprocessableEntityError');
      const params = { request: {}, h: hFake, error };

      // when
      await handle(params.request, params.h, params.error);

      // then
expect(HttpErrors.UnprocessableEntityError).to.have.been.calledWithExactly((error as $TSFixMe).message, error.code, error.meta);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should instantiate PreconditionFailedError when OrganizationLearnerCannotBeDissociatedError', async function () {
      // given
      const error = new OrganizationLearnerCannotBeDissociatedError();
      sinon.stub(HttpErrors, 'PreconditionFailedError');
      const params = { request: {}, h: hFake, error };

      // when
      await handle(params.request, params.h, params.error);

      // then
expect(HttpErrors.PreconditionFailedError).to.have.been.calledWithExactly((error as $TSFixMe).message);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should instantiate PreconditionFailedError when CertificationCandidateOnFinalizedSessionError', async function () {
      // given
      const error = new CertificationCandidateOnFinalizedSessionError();
      sinon.stub(HttpErrors, 'ForbiddenError');
      const params = { request: {}, h: hFake, error };

      // when
      await handle(params.request, params.h, params.error);

      // then
expect(HttpErrors.ForbiddenError).to.have.been.calledWithExactly((error as $TSFixMe).message);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should instantiate ConflictError when CertificationEndedByFinalizationError', async function () {
      // given
      const error = new CertificationEndedByFinalizationError();
      sinon.stub(HttpErrors, 'ConflictError');
      const params = { request: {}, h: hFake, error };

      // when
      await handle(params.request, params.h, params.error);

      // then
expect(HttpErrors.ConflictError).to.have.been.calledWithExactly((error as $TSFixMe).message);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should instantiate ConflictError when SessionStartedDeletionError', async function () {
      // given
      const error = new SessionStartedDeletionError();
      sinon.stub(HttpErrors, 'ConflictError');
      const params = { request: {}, h: hFake, error };

      // when
      await handle(params.request, params.h, params.error);

      // then
expect(HttpErrors.ConflictError).to.have.been.calledWithExactly((error as $TSFixMe).message);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should instantiate UnprocessableEntityError when AdminMemberError', async function () {
      // given
      const error = new AdminMemberError('fake message', 'FAKE_ERROR_CODE');
      sinon.stub(HttpErrors, 'UnprocessableEntityError');
      const params = { request: {}, h: hFake, error };

      // when
      await handle(params.request, params.h, params.error);

      // then
      expect(HttpErrors.UnprocessableEntityError).to.have.been.calledWithExactly(error.message, error.code);
    });
  });
});
