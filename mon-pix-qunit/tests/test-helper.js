import Application from 'mon-pix/app';
import config from 'mon-pix/config/environment';
import { setApplication } from '@ember/test-helpers';
import { start } from 'ember-qunit';
import loadEmberExam from 'ember-exam/test-support/load';

loadEmberExam();

setApplication(Application.create(config.APP));

start();
