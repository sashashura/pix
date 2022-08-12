// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect } = require('../../test-helper');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const errors = require('../../../lib/domain/errors');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Domain | Errors', function () {
  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('should export a AdminMemberError', function () {
    expect(errors.AdminMemberError).to.exist;
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('should export a CertificationCandidateAlreadyLinkedToUserError', function () {
    expect(errors.CertificationCandidateAlreadyLinkedToUserError).to.exist;
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('should export a CertificationCandidateByPersonalInfoNotFoundError', function () {
    expect(errors.CertificationCandidateByPersonalInfoNotFoundError).to.exist;
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('should export a CertificationCandidateByPersonalInfoTooManyMatchesError', function () {
    expect(errors.CertificationCandidateByPersonalInfoTooManyMatchesError).to.exist;
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('should export a CertificationCandidateCreationOrUpdateError', function () {
    expect(errors.CertificationCandidateCreationOrUpdateError).to.exist;
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('should export a CertificationCandidateDeletionError', function () {
    expect(errors.CertificationCandidateDeletionError).to.exist;
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('should export a CertificationCandidateMultipleUserLinksWithinSessionError', function () {
    expect(errors.CertificationCandidateMultipleUserLinksWithinSessionError).to.exist;
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('should export a CertificationCandidatePersonalInfoFieldMissingError', function () {
    expect(errors.CertificationCandidatePersonalInfoFieldMissingError).to.exist;
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('should export a CertificationCandidatePersonalInfoWrongFormat', function () {
    expect(errors.CertificationCandidatePersonalInfoWrongFormat).to.exist;
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('should export a CertificationCandidateForbiddenDeletionError', function () {
    expect(errors.CertificationCandidateForbiddenDeletionError).to.exist;
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('should export a NotFoundError', function () {
    expect(errors.NotFoundError).to.exist;
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('should export a InvalidCertificationReportForFinalization', function () {
    expect(errors.InvalidCertificationReportForFinalization).to.exist;
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('should export a UserAlreadyLinkedToCandidateInSessionError', function () {
    expect(errors.UserAlreadyLinkedToCandidateInSessionError).to.exist;
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('should export a ArchivedCampaignError', function () {
    expect(errors.ArchivedCampaignError).to.exist;
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('should export a CampaignParticipationDeletedError', function () {
    expect(errors.CampaignParticipationDeletedError).to.exist;
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('should export a UserNotAuthorizedToUpdatePasswordError', function () {
    expect(errors.UserNotAuthorizedToUpdatePasswordError).to.exist;
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('should export a UserNotAuthorizedToUpdateCampaignError', function () {
    expect(errors.UserNotAuthorizedToUpdateCampaignError).to.exist;
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('should export a UserNotAuthorizedToFindTrainings', function () {
    expect(errors.UserNotAuthorizedToFindTrainings).to.exist;
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('should export a CsvImportError', function () {
    expect(errors.CsvImportError).to.exist;
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('should export a SiecleXmlImportError', function () {
    expect(errors.SiecleXmlImportError).to.exist;
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('should export a AuthenticationMethodNotFoundError', function () {
    expect(errors.AuthenticationMethodNotFoundError).to.exist;
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('should export a AuthenticationMethodAlreadyExistsError', function () {
    expect(errors.AuthenticationMethodAlreadyExistsError).to.exist;
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('should export a SessionNotAccessible error', function () {
    expect(errors.SessionNotAccessible).to.exist;
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#UserNotFoundError', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should export a UserNotFoundError', function () {
      expect(errors.UserNotFoundError).to.exist;
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should have a getErrorMessage method', function () {
      // given
      const expectedErrorMessage = {
        data: {
          id: ['Ce compte est introuvable.'],
        },
      };

      // then
      const userNotFoundError = new errors.UserNotFoundError();
      expect(userNotFoundError.getErrorMessage).to.be.a('function');
      expect(userNotFoundError.getErrorMessage()).to.eql(expectedErrorMessage);
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#PasswordResetDemandNotFoundError', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should export a PasswordResetDemandNotFoundError', function () {
      expect(errors.PasswordResetDemandNotFoundError).to.exist;
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should have a getErrorMessage method', function () {
      // given
      const expectedErrorMessage = {
        data: {
          temporaryKey: ['Cette demande de réinitialisation n’existe pas.'],
        },
      };

      // then
      const error = new errors.PasswordResetDemandNotFoundError();
      expect(error.getErrorMessage).to.be.a('function');
      expect(error.getErrorMessage()).to.eql(expectedErrorMessage);
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('should export a SessionAlreadyFinalizedError', function () {
    expect(errors.SessionAlreadyFinalizedError).to.exist;
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('should export a TargetProfileInvalidError', function () {
    expect(errors.TargetProfileInvalidError).to.exist;
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#InvalidTemporaryKeyError', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should export a InvalidTemporaryKeyError', function () {
      expect(errors.InvalidTemporaryKeyError).to.exist;
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should have a getErrorMessage method', function () {
      // given
      const expectedErrorMessage = {
        data: {
          temporaryKey: ['Cette demande de réinitialisation n’est pas valide.'],
        },
      };

      // then
      const error = new errors.InvalidTemporaryKeyError();
      expect(error.getErrorMessage).to.be.a('function');
      expect(error.getErrorMessage()).to.eql(expectedErrorMessage);
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#UserNotAuthorizedToCertifyError', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should export a UserNotAuthorizedToCertifyError', function () {
      expect(errors.UserNotAuthorizedToCertifyError).to.exist;
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should have a getErrorMessage method', function () {
      // given
      const expectedErrorMessage = {
        data: {
          authorization: ['Vous n’êtes pas autorisé à passer un test de certification.'],
        },
      };

      // then
      const error = new errors.UserNotAuthorizedToCertifyError();
      expect(error.getErrorMessage).to.be.a('function');
      expect(error.getErrorMessage()).to.eql(expectedErrorMessage);
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#AssessmentEndedError', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should export an AssessmentEndedError', function () {
      expect(errors.AssessmentEndedError).to.exist;
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should have a getErrorMessage method', function () {
      // given
      const expectedErrorMessage = {
        data: {
          error: ["L'évaluation est terminée. Nous n'avons plus de questions à vous poser."],
        },
      };

      // then
      const AssessmentEndedError = new errors.AssessmentEndedError();
      expect(AssessmentEndedError.getErrorMessage).to.be.a('function');
      expect(AssessmentEndedError.getErrorMessage()).to.eql(expectedErrorMessage);
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('EntityValidationError', function () {
    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('#fromJoiErrors', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should populate the invalidAttributes key', function () {
        //given
        const joiErrors = [
          {
            context: {
              key: 'name',
            },
            message: 'name should not be empty',
          },
          {
            context: {
              key: 'email',
            },
            message: 'email is not a valid email address',
          },
        ];

        // when
        const error = errors.EntityValidationError.fromJoiErrors(joiErrors);

        // then
        expect(error.invalidAttributes).to.deep.equal([
          {
            attribute: 'name',
            message: 'name should not be empty',
          },
          {
            attribute: 'email',
            message: 'email is not a valid email address',
          },
        ]);
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('#fromEntityValidationError', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should populate the invalidAttributes key', function () {
        //given
        const error1 = new errors.EntityValidationError({
          invalidAttributes: [
            {
              attribute: 'name',
              message: 'name should not be empty',
            },
            {
              attribute: 'email',
              message: 'email is not a valid email address',
            },
          ],
        });
        const error2 = new errors.EntityValidationError({
          invalidAttributes: [
            {
              attribute: 'card',
              message: 'card should have money on it',
            },
            {
              attribute: 'token',
              message: 'token should be valid',
            },
          ],
        });

        // when
        const error = errors.EntityValidationError.fromMultipleEntityValidationErrors([error1, error2]);

        // then
        expect(error.invalidAttributes).to.deep.equal([
          {
            attribute: 'name',
            message: 'name should not be empty',
          },
          {
            attribute: 'email',
            message: 'email is not a valid email address',
          },
          {
            attribute: 'card',
            message: 'card should have money on it',
          },
          {
            attribute: 'token',
            message: 'token should be valid',
          },
        ]);
      });
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('InvalidCertificationCandidate', function () {
    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('#fromJoiErrorDetail', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return an InvalidCertificationCandidateError', function () {
        // given
        const joiErrorDetail = {
          context: { key: 'someKey' },
          type: 'someType',
        };

        // when
        const error = errors.InvalidCertificationCandidate.fromJoiErrorDetail(joiErrorDetail);

        // then
        expect(error).to.be.instanceOf(errors.InvalidCertificationCandidate);
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should assign key from joiErrorDetail context', function () {
        // given
        const joiErrorDetail = {
          context: { key: 'someKey' },
          type: 'someType',
        };

        // when
        const error = errors.InvalidCertificationCandidate.fromJoiErrorDetail(joiErrorDetail);

        // then
        expect(error.key).to.equal(joiErrorDetail.context.key);
      });

      // eslint-disable-next-line mocha/no-setup-in-describe
      [
        { type: 'any.required', why: 'required' },
        { type: 'date.format', why: 'date_format' },
        { type: 'date.base', why: 'not_a_date' },
        { type: 'string.email', why: 'email_format' },
        { type: 'string.base', why: 'not_a_string' },
        { type: 'number.base', why: 'not_a_number' },
        { type: 'number.integer', why: 'not_a_number' },
      ].forEach(({ type, why }) => {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it(`should assign why "${why}" to error when joi error type is "${type}"`, async function () {
          // given
          const joiErrorDetail = {
            context: { key: 'someKey' },
            type,
          };

          // when
          const error = errors.InvalidCertificationCandidate.fromJoiErrorDetail(joiErrorDetail);

          // then
          expect(error.why).to.equal(why);
        });
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should let why empty when type is unknown', async function () {
        // given
        const joiErrorDetail = {
          context: { key: 'someKey' },
          type: 'someUnknownType',
        };

        // when
        const error = errors.InvalidCertificationCandidate.fromJoiErrorDetail(joiErrorDetail);

        // then
        expect(error.why).to.be.null;
      });
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('CertificationCandidatesImportError', function () {
    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('#fromInvalidCertificationCandidateError', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return a CertificationCandidatesImportError', function () {
        // given
        const invalidCertificationCandidateError = {
          key: 'someKey',
          why: 'someWhy',
        };

        // when
        const error = errors.CertificationCandidatesImportError.fromInvalidCertificationCandidateError(
          invalidCertificationCandidateError,
          {},
          1
        );

        // then
        expect(error).to.be.instanceOf(errors.CertificationCandidatesImportError);
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should start the error message with line number', function () {
        // given
        const lineNumber = 20;
        const invalidCertificationCandidateError = {
          key: 'someKey',
          why: 'someWhy',
        };

        // when
        const error = errors.CertificationCandidatesImportError.fromInvalidCertificationCandidateError(
          invalidCertificationCandidateError,
          {},
          lineNumber
        );

        // then
        expect(error.message.startsWith(`Ligne ${lineNumber} :`)).to.be.true;
      });

      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('when err.why is known', function () {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should include the right label when found in the keyLabelMap', function () {
          // given
          const lineNumber = 20;
          const invalidCertificationCandidateError = {
            key: 'someKey',
            why: 'not_a_date',
          };
          const keyLabelMap = {
            someKey: 'someLabel',
            someOtherKey: 'someOtherLabel',
          };

          // when
          const error = errors.CertificationCandidatesImportError.fromInvalidCertificationCandidateError(
            invalidCertificationCandidateError,
            keyLabelMap,
            lineNumber
          );

          // then
          expect(error.message).to.contain('Le champ “someLabel”');
        });

        // eslint-disable-next-line mocha/no-setup-in-describe
        [
          { why: 'not_a_date', content: 'doit être au format jj/mm/aaaa.' },
          { why: 'date_format', content: 'doit être au format jj/mm/aaaa.' },
          { why: 'email_format', content: 'doit être au format email.' },
          { why: 'not_a_string', content: 'doit être une chaîne de caractères.' },
          { why: 'not_a_number', content: 'doit être un nombre.' },
          { why: 'required', content: 'est obligatoire.' },
        ].forEach(({ why, content }) => {
          // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
          it(`message should contain "${content}" when why is "${why}"`, async function () {
            // given
            const invalidCertificationCandidateError = {
              key: 'someKey',
              why,
            };
            const keyLabelMap = {
              someKey: 'someLabel',
            };

            // when
            const error = errors.CertificationCandidatesImportError.fromInvalidCertificationCandidateError(
              invalidCertificationCandidateError,
              keyLabelMap,
              1
            );

            // then
            expect(error.message.endsWith(content)).to.be.true;
          });
        });
      });

      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('when err.why is unknown', function () {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should display generic message', function () {
          // given
          const invalidCertificationCandidateError = {
            key: 'someKey',
            why: 'unknown',
          };
          const keyLabelMap = {
            someKey: 'someLabel',
          };

          // when
          const error = errors.CertificationCandidatesImportError.fromInvalidCertificationCandidateError(
            invalidCertificationCandidateError,
            keyLabelMap,
            1
          );

          // then
          expect(error.message).to.contain("Quelque chose s'est mal passé. Veuillez réessayer");
        });
      });
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('should export a UnknownCountryForStudentEnrollmentError', function () {
    expect(errors.UnknownCountryForStudentEnrollmentError).to.exist;
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('should export a OrganizationLearnersCouldNotBeSavedError', function () {
    expect(errors.OrganizationLearnersCouldNotBeSavedError).to.exist;
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('should export an InvalidVerificationCodeError', function () {
    expect(errors.InvalidVerificationCodeError).to.exist;
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('should export an EmailModificationDemandNotFoundOrExpiredError', function () {
    expect(errors.EmailModificationDemandNotFoundOrExpiredError).to.exist;
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('should export an OrganizationLearnerCannotBeDissociatedError', function () {
    expect(errors.OrganizationLearnerCannotBeDissociatedError).to.exist;
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('should export an AlreadyAcceptedOrCancelledOrganizationInvitationError', function () {
    expect(errors.AlreadyAcceptedOrCancelledOrganizationInvitationError).to.exist;
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('should export an MissingAttributesError', function () {
    expect(errors.MissingAttributesError).to.exist;
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('CertificationCandidateAddError', function () {
    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('#fromInvalidCertificationCandidateError', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return a CertificationCandidateAddError', function () {
        // given
        const invalidCertificationCandidateError = {
          key: 'someKey',
          why: 'someWhy',
        };

        // when
        const error = errors.CertificationCandidateAddError.fromInvalidCertificationCandidateError(
          invalidCertificationCandidateError,
          {},
          1
        );

        // then
        expect(error).to.be.instanceOf(errors.CertificationCandidateAddError);
      });

      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('when err.why is known', function () {
        // eslint-disable-next-line mocha/no-setup-in-describe
        [
          {
            why: 'not_a_billing_mode',
            message: `Le champ “Tarification part Pix” ne peut contenir qu'une des valeurs suivantes: Gratuite, Payante ou Prépayée.`,
          },
          {
            why: 'prepayment_code_null',
            message: `Le champ “Code de prépaiement” est obligatoire puisque l’option “Prépayée” a été sélectionnée pour ce candidat.`,
          },
          {
            why: 'prepayment_code_not_null',
            message: `Le champ “Code de prépaiement” doit rester vide puisque l’option “Prépayée” n'a pas été sélectionnée pour ce candidat.`,
          },
        ].forEach(({ why, message }) => {
          // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
          it(`message should be "${message}" when why is "${why}"`, async function () {
            // given
            const invalidCertificationCandidateError = { why };

            // when
            const error = errors.CertificationCandidateAddError.fromInvalidCertificationCandidateError(
              invalidCertificationCandidateError
            );

            // then
            expect(error.message).to.equal(message);
          });
        });
      });

      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('when err.why is unknown', function () {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should display generic message', function () {
          // given
          const invalidCertificationCandidateError = {
            key: 'someKey',
            why: 'unknown',
          };

          // when
          const error = errors.CertificationCandidateAddError.fromInvalidCertificationCandidateError(
            invalidCertificationCandidateError
          );

          // then
          expect(error.message).to.contain('Candidat de certification invalide.');
        });
      });
    });
  });
});
