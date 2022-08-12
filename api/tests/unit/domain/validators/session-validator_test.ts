// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, domainBuilder, catchErr } = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'statuses'.
const { statuses } = require('../../../../lib/domain/models/Session');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'EntityVali... Remove this comment to see the full error message
const { EntityValidationError } = require('../../../../lib/domain/errors');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'sessionVal... Remove this comment to see the full error message
const sessionValidator = require('../../../../lib/domain/validators/session-validator');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'MISSING_VA... Remove this comment to see the full error message
const MISSING_VALUE = '';

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Domain | Validators | session-validator', function () {
  let session: $TSFixMe;

  // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
  beforeEach(function () {
    session = domainBuilder.buildSession({
      address: '51 rue des lillas',
      room: 'Salle John Doe',
      date: '2000-10-20',
      time: '14:30',
      examiner: 'Mister T',
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#validate', function () {
    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when validation is successful', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should not throw any error', function () {
        expect(sessionValidator.validate(session)).to.not.throw;
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when session data validation fails', function () {
      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('on address attribute', function () {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should reject with error when address is missing', function () {
          // given
          const expectedErrors = [
            {
              attribute: 'address',
              message: 'Veuillez indiquer un nom de site.',
            },
          ];
          session.address = MISSING_VALUE;

          try {
            // when
            sessionValidator.validate(session);
            expect.fail('should have thrown an error');
          } catch (entityValidationErrors) {
            // then
            expect(entityValidationErrors).with.deep.property('invalidAttributes', expectedErrors);
          }
        });
      });

      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('on room attribute', function () {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should reject with error when room is missing', async function () {
          // given
          const expectedErrors = [
            {
              attribute: 'room',
              message: 'Veuillez indiquer un nom de salle.',
            },
          ];
          session.room = MISSING_VALUE;

          try {
            // when
            sessionValidator.validate(session);
            expect.fail('should have thrown an error');
          } catch (entityValidationErrors) {
            // then
            expect(entityValidationErrors).with.deep.property('invalidAttributes', expectedErrors);
          }
        });
      });

      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('on date attribute', function () {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should reject with error when date is missing', function () {
          // given
          const expectedErrors = [
            {
              attribute: 'date',
              message: 'Veuillez indiquer une date de début.',
            },
          ];
          session.date = MISSING_VALUE;

          try {
            // when
            sessionValidator.validate(session);
            expect.fail('should have thrown an error');
          } catch (entityValidationErrors) {
            // then
            expect(entityValidationErrors).with.deep.property('invalidAttributes', expectedErrors);
          }
        });
      });

      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('on time attribute', function () {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should reject with error when time is an empty string', function () {
          // given
          const expectedErrors = [
            {
              attribute: 'time',
              message: 'Veuillez indiquer une heure de début.',
            },
          ];
          session.time = '';

          try {
            // when
            sessionValidator.validate(session);
            expect.fail('should have thrown an error');
          } catch (entityValidationErrors) {
            // then
            expect(entityValidationErrors).with.deep.property('invalidAttributes', expectedErrors);
          }
        });

        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should reject with error when time ihas a format different than HH:MM', function () {
          // given
          const expectedErrors = [
            {
              attribute: 'time',
              message: 'Veuillez indiquer une heure de début.',
            },
          ];
          session.time = '14:23:30';

          try {
            // when
            sessionValidator.validate(session);
            expect.fail('should have thrown an error');
          } catch (entityValidationErrors) {
            // then
            expect(entityValidationErrors).with.deep.property('invalidAttributes', expectedErrors);
          }
        });
      });

      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('on examiner attribute', function () {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should reject with error when examiner is missing', function () {
          // given
          const expectedErrors = [
            {
              attribute: 'examiner',
              message: 'Veuillez indiquer un(e) surveillant(e).',
            },
          ];
          session.examiner = MISSING_VALUE;

          try {
            // when
            sessionValidator.validate(session);
            expect.fail('should have thrown an error');
          } catch (entityValidationErrors) {
            // then
            expect(entityValidationErrors).with.deep.property('invalidAttributes', expectedErrors);
          }
        });
      });
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#validateFilters', function () {
    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('return value', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return the filters in a normalized form', function () {
        const value = sessionValidator.validateAndNormalizeFilters({
          id: '123',
          status: 'finalized',
        });

        expect(typeof value.id).to.equal('number');
        expect(value.status).to.equal('finalized');
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when validating id', function () {
      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('when id not in submitted filters', function () {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should not throw any error', function () {
          expect(sessionValidator.validateAndNormalizeFilters({})).to.not.throw;
        });
      });

      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('when id is in submitted filters', function () {
        // @ts-expect-error TS(2304): Cannot find name 'context'.
        context('when id is not an integer', function () {
          // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
          it('should throw an error', async function () {
            // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
            const error = await catchErr(sessionValidator.validateAndNormalizeFilters)({ id: 'salut' });
            expect(error).to.be.instanceOf(EntityValidationError);
          });
        });

        // @ts-expect-error TS(2304): Cannot find name 'context'.
        context('when id is an integer', function () {
          // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
          it('accept a string containing an int', function () {
            expect(sessionValidator.validateAndNormalizeFilters({ id: '123' })).to.not.throw;
          });

          // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
          it('should not throw any error', function () {
            expect(sessionValidator.validateAndNormalizeFilters({ id: 123 })).to.not.throw;
          });
        });
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when validating certificationCenterName', function () {
      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('when certificationCenterName not in submitted filters', function () {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should not throw any error', function () {
          expect(sessionValidator.validateAndNormalizeFilters({})).to.not.throw;
        });
      });

      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('when certificationCenterName is in submitted filters', function () {
        // @ts-expect-error TS(2304): Cannot find name 'context'.
        context('when certificationCenterName is not an string', function () {
          // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
          it('should throw an error', async function () {
            // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
            const error = await catchErr(sessionValidator.validateAndNormalizeFilters)({
              certificationCenterName: 123,
            });
            expect(error).to.be.instanceOf(EntityValidationError);
          });
        });

        // @ts-expect-error TS(2304): Cannot find name 'context'.
        context('when certificationCenterName is a string', function () {
          // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
          it('should not throw an error', async function () {
            const certificationCenterName = '   Coucou le dév qui lit ce message !   ';
            expect(sessionValidator.validateAndNormalizeFilters({ certificationCenterName })).to.not.throw;
            expect(
              sessionValidator.validateAndNormalizeFilters({ certificationCenterName }).certificationCenterName
            ).to.equal(certificationCenterName.trim());
          });
        });
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when validating status', function () {
      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('when status not in submitted filters', function () {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should not throw any error', function () {
          expect(sessionValidator.validateAndNormalizeFilters({})).to.not.throw;
        });
      });

      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('when status is in submitted filters', function () {
        // @ts-expect-error TS(2304): Cannot find name 'context'.
        context('when status is not an string', function () {
          // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
          it('should throw an error', async function () {
            // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
            const error = await catchErr(sessionValidator.validateAndNormalizeFilters)({ status: 123 });
            expect(error).to.be.instanceOf(EntityValidationError);
          });
        });

        // @ts-expect-error TS(2304): Cannot find name 'context'.
        context('when status is not in the statuses list', function () {
          // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
          it('should throw an error', async function () {
            // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
            const error = await catchErr(sessionValidator.validateAndNormalizeFilters)({ status: 'SomeOtherStatus' });
            expect(error).to.be.instanceOf(EntityValidationError);
          });
        });

        // @ts-expect-error TS(2304): Cannot find name 'context'.
        context('when status is in the statuses list', function () {
          // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
          it('should not throw an error', async function () {
            expect(sessionValidator.validateAndNormalizeFilters({ status: (statuses as $TSFixMe).CREATED })).to.not.throw;
            expect(sessionValidator.validateAndNormalizeFilters({ status: (statuses as $TSFixMe).FINALIZED })).to.not.throw;
            expect(sessionValidator.validateAndNormalizeFilters({ status: (statuses as $TSFixMe).IN_PROCESS })).to.not.throw;
            expect(sessionValidator.validateAndNormalizeFilters({ status: (statuses as $TSFixMe).PROCESSED })).to.not.throw;
          });
        });
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when validating resultsSentToPrescriberAt', function () {
      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('when resultsSentToPrescriberAt not in submitted filters', function () {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should not throw any error', function () {
          expect(sessionValidator.validateAndNormalizeFilters({})).to.not.throw;
        });
      });

      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('when resultsSentToPrescriberAt is in submitted filters', function () {
        // @ts-expect-error TS(2304): Cannot find name 'context'.
        context('when resultsSentToPrescriberAt is not a boolean', function () {
          // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
          it('should throw an error', async function () {
            // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
            const error = await catchErr(sessionValidator.validateAndNormalizeFilters)({
              resultsSentToPrescriberAt: 123,
            });
            expect(error).to.be.instanceOf(EntityValidationError);
          });
        });

        // @ts-expect-error TS(2304): Cannot find name 'context'.
        context('when resultsSentToPrescriberAt is not in the resultsSentToPrescriberAt list', function () {
          // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
          it('should throw an error', async function () {
            // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
            const error = await catchErr(sessionValidator.validateAndNormalizeFilters)({
              resultsSentToPrescriberAt: 'SomeOtherValue',
            });
            expect(error).to.be.instanceOf(EntityValidationError);
          });
        });

        // @ts-expect-error TS(2304): Cannot find name 'context'.
        context('when resultsSentToPrescriberAt is a boolean', function () {
          // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
          it('should not throw an error', async function () {
            expect(sessionValidator.validateAndNormalizeFilters({ resultsSentToPrescriberAt: true })).to.not.throw;
            expect(sessionValidator.validateAndNormalizeFilters({ resultsSentToPrescriberAt: false })).to.not.throw;
          });
        });
      });
    });
  });
});
