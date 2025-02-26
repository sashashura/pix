import { setupApplicationTest } from 'ember-mocha';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { click, currentURL, find, visit } from '@ember/test-helpers';
import { beforeEach, describe, it } from 'mocha';
import { expect } from 'chai';
import { authenticateByEmail } from '../helpers/authentication';
import { fillCertificationJoiner, fillCertificationStarter } from '../helpers/certification';
import setupIntl from '../helpers/setup-intl';
import { contains } from '../helpers/contains';
import { assessmentStates } from 'mon-pix/models/assessment';
import { Response } from 'miragejs';

describe('Acceptance | Certification | Certification Course', function () {
  setupApplicationTest();
  setupMirage();
  setupIntl();

  let user;

  describe('Start a certification course', function () {
    context('When user is not logged in', function () {
      beforeEach(async function () {
        user = server.create('user', 'withEmail');
        await visit('/certifications');
      });

      it('should redirect to login page', function () {
        // then
        expect(currentURL()).to.match(/connexion/);
      });
    });

    context('When user is logged in', function () {
      context('When user is not certifiable', function () {
        beforeEach(async function () {
          user = server.create('user', 'withEmail', 'notCertifiable');
          await authenticateByEmail(user);
          return visit('/certifications');
        });

        it('should render the not certifiable template', function () {
          expect(find('.certification-not-certifiable__title').textContent.trim()).to.equal(
            "Votre profil n'est pas encore certifiable."
          );
        });
      });

      context('When user is certifiable', function () {
        beforeEach(async function () {
          user = server.create('user', 'withEmail', 'certifiable', { hasSeenOtherChallengesTooltip: true });
          await authenticateByEmail(user);
          return visit('/certifications');
        });

        it("should display a link to user's certifications", async function () {
          // then
          expect(contains(this.intl.t('pages.certification-start.link-to-user-certification'))).to.exist;
        });

        context('when no candidate with given info has been registered in the given session', function () {
          beforeEach(async function () {
            // when
            await fillCertificationJoiner({
              sessionId: '1',
              firstName: 'Laura',
              lastName: 'PasInscrite',
              dayOfBirth: '04',
              monthOfBirth: '01',
              yearOfBirth: '1990',
              intl: this.intl,
            });
          });

          it('should display an error message', function () {
            // then
            expect(contains(this.intl.t('pages.certification-joiner.error-messages.generic.disclaimer'))).to.exist;
            expect(
              contains(this.intl.t('pages.certification-joiner.error-messages.generic.check-session-number'))
            ).to.exist;
            expect(
              contains(this.intl.t('pages.certification-joiner.error-messages.generic.check-personal-info'))
            ).to.exist;
          });
        });

        context('when several candidates with given info are found in the given session', function () {
          beforeEach(async function () {
            // when
            await fillCertificationJoiner({
              sessionId: '1',
              firstName: 'Laura',
              lastName: 'PlusieursMatchs',
              dayOfBirth: '04',
              monthOfBirth: '01',
              yearOfBirth: '1990',
              intl: this.intl,
            });
          });

          it('should display an error message', function () {
            // then
            expect(contains(this.intl.t('pages.certification-joiner.error-messages.generic.disclaimer'))).to.exist;
            expect(
              contains(this.intl.t('pages.certification-joiner.error-messages.generic.check-session-number'))
            ).to.exist;
            expect(
              contains(this.intl.t('pages.certification-joiner.error-messages.generic.check-personal-info'))
            ).to.exist;
          });
        });

        context('when user has already been linked to another candidate in the session', function () {
          beforeEach(async function () {
            // when
            await fillCertificationJoiner({
              sessionId: '1',
              firstName: 'Laura',
              lastName: 'UtilisateurLiéAutre',
              dayOfBirth: '04',
              monthOfBirth: '01',
              yearOfBirth: '1990',
              intl: this.intl,
            });
          });

          it('should display an error message', function () {
            // then
            expect(contains(this.intl.t('pages.certification-joiner.error-messages.generic.disclaimer'))).to.exist;
            expect(
              contains(this.intl.t('pages.certification-joiner.error-messages.generic.check-session-number'))
            ).to.exist;
            expect(
              contains(this.intl.t('pages.certification-joiner.error-messages.generic.check-personal-info'))
            ).to.exist;
          });
        });

        context('when user is already linked to this candidate', function () {
          beforeEach(async function () {
            // given
            this.server.schema.certificationCandidates.create({
              id: 1,
              firstName: 'Laura',
              lastName: 'CandidatLiéUtilisateur',
              sessionId: 1,
              birthdate: '1990-01-04',
            });
            this.server.create('certification-candidate-subscription', {
              id: 1,
              sessionId: 1,
              eligibleSubscriptions: [],
              nonEligibleSubscriptions: [],
            });
            // when
            await fillCertificationJoiner({
              sessionId: '1',
              firstName: 'Laura',
              lastName: 'CandidatLiéUtilisateur',
              dayOfBirth: '04',
              monthOfBirth: '01',
              yearOfBirth: '1990',
              intl: this.intl,
            });
          });

          it('should redirect to certification start route', function () {
            // then
            expect(currentURL()).to.equal('/certifications/candidat/1');
          });
        });

        context('when user is successfully linked to the candidate', function () {
          beforeEach(async function () {
            // given
            this.server.create('certification-candidate-subscription', {
              id: 2,
              sessionId: 1,
              eligibleSubscriptions: [],
              nonEligibleSubscriptions: [],
            });

            // when
            await fillCertificationJoiner({
              sessionId: '1',
              firstName: 'Laura',
              lastName: 'Bravo',
              dayOfBirth: '04',
              monthOfBirth: '01',
              yearOfBirth: '1990',
              intl: this.intl,
            });
          });

          it('should redirect to certification start route', function () {
            // then
            expect(currentURL()).to.equal('/certifications/candidat/2');
          });
        });

        context('when user takes the certification course', function () {
          let certificationCourse;
          let assessment;
          const NB_CHALLENGES = 3;

          beforeEach(function () {
            for (let i = 0; i < NB_CHALLENGES; ++i) {
              server.create('challenge', 'forCertification');
            }
            certificationCourse = this.server.create('certification-course', {
              accessCode: 'ABCD12',
              sessionId: 1,
              nbChallenges: NB_CHALLENGES,
              firstName: 'Laura',
              lastName: 'Bravo',
            });
            assessment = certificationCourse.assessment;

            this.server.create('certification-candidate-subscription', {
              id: 2,
              sessionId: 1,
              eligibleSubscriptions: [],
              nonEligibleSubscriptions: [],
            });
          });

          context('when user enter a correct code session', function () {
            beforeEach(async function () {
              // when
              await fillCertificationJoiner({
                sessionId: '1',
                firstName: 'Laura',
                lastName: 'Bravo',
                dayOfBirth: '04',
                monthOfBirth: '01',
                yearOfBirth: '1990',
                intl: this.intl,
              });
              await fillCertificationStarter({ accessCode: 'ABCD12', intl: this.intl });
            });

            it('should be redirected on the first challenge of an assessment', async function () {
              // then
              expect(currentURL().startsWith(`/assessments/${assessment.id}/challenges`)).to.be.true;
            });

            it('should navigate to next challenge when we click pass', async function () {
              // when
              await click('.challenge-actions__action-skip-text');
              // then
              expect(currentURL().startsWith(`/assessments/${assessment.id}/challenges`)).to.be.true;
            });

            context('after skipping the all challenges of the certification course', function () {
              it('should navigate to redirect to certification result page at the end of the assessment', async function () {
                // when
                for (let i = 0; i < NB_CHALLENGES; ++i) {
                  await click('.challenge-actions__action-skip');
                }

                // then
                expect(currentURL()).to.equal(`/certifications/${certificationCourse.id}/results`);
              });

              it('should display the "presque terminé" message', async function () {
                // when
                for (let i = 0; i < NB_CHALLENGES; ++i) {
                  await click('.challenge-actions__action-skip');
                }

                // then
                expect(contains('Vous avez presque terminé')).to.exist;
              });
            });
          });

          context('When stop and relaunch the certification course', function () {
            it('should be redirected directly on the certification course', async function () {
              // given
              await fillCertificationJoiner({
                sessionId: '1',
                firstName: 'Laura',
                lastName: 'Bravo',
                dayOfBirth: '04',
                monthOfBirth: '01',
                yearOfBirth: '1990',
                intl: this.intl,
              });
              await fillCertificationStarter({ accessCode: 'ABCD12', intl: this.intl });

              await click('.challenge-actions__action-skip');
              await visit('/');
              // when
              await visit(`/certifications/${certificationCourse.id}`);

              // then
              expect(currentURL().startsWith(`/assessments/${assessment.id}/challenges`)).to.be.true;
            });
          });
        });
      });

      context('when is isEndTestScreenRemovalEnabled is true', function () {
        it('should display "Test terminé !"', async function () {
          this.timeout(5000);
          // given
          user = server.create('user', 'withEmail', 'certifiable', { hasSeenOtherChallengesTooltip: true });

          const NB_CHALLENGES = 3;
          for (let i = 0; i < NB_CHALLENGES; ++i) {
            server.create('challenge', 'forCertification');
          }
          this.server.create('certification-course', {
            accessCode: 'ABCD12',
            sessionId: 1,
            nbChallenges: NB_CHALLENGES,
            firstName: 'Laura',
            lastName: 'Bravo',
            isEndTestScreenRemovalEnabled: true,
          });
          this.server.create('certification-candidate-subscription', {
            id: 2,
            sessionId: 1,
            eligibleSubscriptions: [],
            nonEligibleSubscriptions: [],
          });

          await authenticateByEmail(user);
          await visit('/certifications');
          await fillCertificationJoiner({
            sessionId: '1',
            firstName: 'Laura',
            lastName: 'Bravo',
            dayOfBirth: '04',
            monthOfBirth: '01',
            yearOfBirth: '1990',
            intl: this.intl,
          });
          await fillCertificationStarter({ accessCode: 'ABCD12', intl: this.intl });

          // when
          for (let i = 0; i < NB_CHALLENGES; ++i) {
            await click('.challenge-actions__action-skip');
          }

          // then
          expect(contains('Test terminé !')).to.exist;
        });
      });

      context('when test was ended by supervisor', function () {
        it('should display "Votre surveillant a mis fin…"', async function () {
          // given
          const user = server.create('user', 'withEmail', 'certifiable', { hasSeenOtherChallengesTooltip: true });
          const certificationCourse = this.server.create('certification-course', {
            isEndTestScreenRemovalEnabled: true,
          });
          this.server.create('assessment', {
            type: 'CERTIFICATION',
            certificationCourseId: certificationCourse.id,
            state: assessmentStates.ENDED_BY_SUPERVISOR,
          });

          // when
          await authenticateByEmail(user);
          await visit(`/certifications/${certificationCourse.id}/results`);

          // then
          expect(
            contains(
              'Votre surveillant a mis fin à votre test de certification. Vous ne pouvez plus continuer de répondre aux questions.'
            )
          ).to.exist;
        });
      });

      context('when user has already started the certification', function () {
        context('when test was ended by supervisor', function () {
          it('should redirect to "Votre surveillant a mis fin…"', async function () {
            // given
            user = server.create('user', 'withEmail', 'certifiable', { hasSeenOtherChallengesTooltip: true });
            server.create('challenge', 'forCertification');
            server.create('challenge', 'forCertification');
            server.create('certification-course', {
              id: 99,
              accessCode: 'ABCD12',
              sessionId: 1,
              nbChallenges: 2,
              firstName: 'Laura',
              lastName: 'Bravo',
              isEndTestScreenRemovalEnabled: true,
            });
            const assessment = server.create('assessment', {
              certificationCourseId: 99,
              type: 'CERTIFICATION',
              state: assessmentStates.STARTED,
            });
            server.create('certification-candidate-subscription', {
              id: 2,
              sessionId: 1,
              eligibleSubscriptions: [],
              nonEligibleSubscriptions: [],
            });

            await authenticateByEmail(user);
            await visit('/certifications');
            await fillCertificationJoiner({
              sessionId: '1',
              firstName: 'Laura',
              lastName: 'Bravo',
              dayOfBirth: '01',
              monthOfBirth: '01',
              yearOfBirth: '2000',
              intl: this.intl,
            });
            await fillCertificationStarter({ accessCode: 'ABCD12', intl: this.intl });

            // when
            assessment.update({ state: assessmentStates.ENDED_BY_SUPERVISOR });
            this.server.post('/answers', generate400Error('Le surveillant a mis fin à votre test de certification.'));
            await click('.challenge-actions__action-skip');

            // then
            expect(
              contains(
                'Votre surveillant a mis fin à votre test de certification. Vous ne pouvez plus continuer de répondre aux questions.'
              )
            ).to.exist;
          });
        });
      });

      context('when test was ended by finalization', function () {
        it('should display "La session a été finalisée par votre centre de certification..."', async function () {
          // given
          const user = server.create('user', 'withEmail', 'certifiable', { hasSeenOtherChallengesTooltip: true });
          const certificationCourse = this.server.create('certification-course', {
            isEndTestScreenRemovalEnabled: false,
          });
          this.server.create('assessment', {
            certificationCourseId: certificationCourse.id,
            state: assessmentStates.ENDED_DUE_TO_FINALIZATION,
          });

          // when
          await authenticateByEmail(user);
          await visit(`/certifications/${certificationCourse.id}/results`);

          // then
          expect(
            contains(
              'La session a été finalisée par votre centre de certification. Vous ne pouvez plus continuer de répondre aux questions.'
            )
          ).to.exist;
        });
      });
    });
  });
});

function generate400Error(detail) {
  return () => {
    return new Response(
      400,
      {},
      {
        errors: [{ status: '400', detail }],
      }
    );
  };
}
