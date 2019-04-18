import { htmlSafe } from '@ember/string';
import { computed } from '@ember/object';
import Component from '@ember/component';
import AssessmentProgression from '../models/assessment-progression';

export default Component.extend({

  classNames: ['progress'],

  progression: AssessmentProgression.create(),

  setProgression() {
    let nbChallenges;
    if (this.get('assessment.hasCheckpoints')) {
      nbChallenges = 5;
    } else {
      nbChallenges = this.get('assessment.course.nbChallenges');
    }
    this.set('progression', AssessmentProgression.create({
      assessmentType: this.get('assessment.type'),
      nbAnswers: this.get('assessment.answers.length'),
      nbChallenges
    }));
  },

  barStyle: computed('progression', function() {
    return htmlSafe(`width: ${this.get('progression.valueNow')}%`);
  }),

  willRender() {
    this.setProgression();
  }

});
