// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'sinon'.
const { sinon, expect, nock } = require('../../../test-helper');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'mailCheck'... Remove this comment to see the full error message
const mailCheck = require('../../../../lib/infrastructure/mail-check');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'mailing'.
const { mailing } = require('../../../../lib/config');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Sendinblue... Remove this comment to see the full error message
const SendinblueProvider = require('../../../../lib/infrastructure/mailers/SendinblueProvider');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Class | SendinblueProvider', function () {
  // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
  beforeEach(function () {
    nock('https://api.sendinblue.com:443').post('/v3/smtp/email').reply();
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#sendEmail', function () {
    const senderEmailAddress = 'no-reply@example.net';
    const userEmailAddress = 'user@example.net';
    const templateId = 129291;

    let stubbedSendinblueSMTPApi: $TSFixMe;
    let mailingProvider: $TSFixMe;

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when mail sending is enabled', function () {
      // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
      beforeEach(function () {
        sinon.stub(mailing, 'enabled').value(true);
        sinon.stub(mailing, 'provider').value('sendinblue');

        sinon.stub(SendinblueProvider, 'createSendinblueSMTPApi');
        sinon.stub(mailCheck, 'checkMail').withArgs(userEmailAddress).resolves();

        stubbedSendinblueSMTPApi = { sendTransacEmail: sinon.stub() };
        (SendinblueProvider.createSendinblueSMTPApi as $TSFixMe).returns(stubbedSendinblueSMTPApi);

        mailingProvider = new SendinblueProvider();
      });

      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('when email check succeeds', function () {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should call the given sendinblue api instance', async function () {
          // given
          const options = {
            from: senderEmailAddress,
            to: userEmailAddress,
            fromName: 'Ne pas repondre',
            subject: 'Creation de compte',
            template: templateId,
          };

          const expectedPayload = {
            to: [
              {
                email: userEmailAddress,
              },
            ],
            sender: {
              name: 'Ne pas repondre',
              email: senderEmailAddress,
            },
            subject: 'Creation de compte',
            templateId,
            headers: {
              'content-type': 'application/json',
              accept: 'application/json',
            },
          };

          // when
          await mailingProvider.sendEmail(options);

          // then
          expect(stubbedSendinblueSMTPApi.sendTransacEmail).to.have.been.calledWithExactly(expectedPayload);
        });

        // @ts-expect-error TS(2304): Cannot find name 'context'.
        context('when tags property is given', function () {
          // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
          it('should add tags when it is not a empty array', async function () {
            // given
            const tags = ['TEST'];

            const options = {
              from: senderEmailAddress,
              to: userEmailAddress,
              fromName: 'Ne pas repondre',
              subject: 'Creation de compte',
              template: templateId,
              tags,
            };

            const expectedPayload = {
              to: [
                {
                  email: userEmailAddress,
                },
              ],
              sender: {
                name: 'Ne pas repondre',
                email: senderEmailAddress,
              },
              subject: 'Creation de compte',
              templateId,
              headers: {
                'content-type': 'application/json',
                accept: 'application/json',
              },
              tags,
            };

            // when
            await mailingProvider.sendEmail(options);

            // then
            expect(stubbedSendinblueSMTPApi.sendTransacEmail).to.have.been.calledWithExactly(expectedPayload);
          });

          // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
          it('should not add tags when it is empty', async function () {
            // given
            const tags = null;

            const options = {
              from: senderEmailAddress,
              to: userEmailAddress,
              fromName: 'Ne pas repondre',
              subject: 'Creation de compte',
              template: templateId,
              tags,
            };

            const expectedPayload = {
              to: [
                {
                  email: userEmailAddress,
                },
              ],
              sender: {
                name: 'Ne pas repondre',
                email: senderEmailAddress,
              },
              subject: 'Creation de compte',
              templateId,
              headers: {
                'content-type': 'application/json',
                accept: 'application/json',
              },
            };

            // when
            await mailingProvider.sendEmail(options);

            // then
            expect(stubbedSendinblueSMTPApi.sendTransacEmail).to.have.been.calledWithExactly(expectedPayload);
          });
        });
      });
    });
  });
});
