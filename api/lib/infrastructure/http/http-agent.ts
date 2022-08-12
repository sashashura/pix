// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'axios'.
// eslint-disable-next-line no-restricted-modules
const axios = require('axios');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'performanc... Remove this comment to see the full error message
const { performance } = require('perf_hooks');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'logInfoWit... Remove this comment to see the full error message
const { logInfoWithCorrelationIds, logErrorWithCorrelationIds } = require('../monitoring-tools');

class HttpResponse {
  code: $TSFixMe;
  data: $TSFixMe;
  isSuccessful: $TSFixMe;
  constructor({
    code,
    data,
    isSuccessful
  }: $TSFixMe) {
    this.code = code;
    this.data = data;
    this.isSuccessful = isSuccessful;
  }
}

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  async post({
    url,
    payload,
    headers
  }: $TSFixMe) {
    const startTime = performance.now();
    let responseTime = null;
    try {
      const httpResponse = await axios.post(url, payload, {
        headers,
      });
      responseTime = performance.now() - startTime;
      logInfoWithCorrelationIds({
        metrics: { responseTime },
        message: `End POST request to ${url} success: ${httpResponse.status}`,
      });

      return new HttpResponse({
        code: httpResponse.status,
        data: httpResponse.data,
        isSuccessful: true,
      });
    } catch (httpErr) {
      responseTime = performance.now() - startTime;
      let code = null;
      let data;

      if ((httpErr as $TSFixMe).response) {
        code = (httpErr as $TSFixMe).response.status;
        data = (httpErr as $TSFixMe).response.data;
      } else {
        data = (httpErr as $TSFixMe).message;
      }

      logErrorWithCorrelationIds({
        metrics: { responseTime },
        message: `End POST request to ${url} error: ${code || ''} ${data.toString()}`,
      });

      return new HttpResponse({
        code,
        data,
        isSuccessful: false,
      });
    }
  },
  async get({
    url,
    payload,
    headers
  }: $TSFixMe) {
    const startTime = performance.now();
    let responseTime = null;
    try {
      const config = { data: payload, headers };
      const httpResponse = await axios.get(url, config);
      responseTime = performance.now() - startTime;
      logInfoWithCorrelationIds({
        metrics: { responseTime },
        message: `End GET request to ${url} success: ${httpResponse.status}`,
      });

      return new HttpResponse({
        code: httpResponse.status,
        data: httpResponse.data,
        isSuccessful: true,
      });
    } catch (httpErr) {
      responseTime = performance.now() - startTime;
      const isSuccessful = false;

      let code;
      let data;

      if ((httpErr as $TSFixMe).response) {
        code = (httpErr as $TSFixMe).response.status;
        data = (httpErr as $TSFixMe).response.data;
      } else {
        code = '500';
        data = null;
      }

      logErrorWithCorrelationIds({
        metrics: { responseTime },
        message: `End GET request to ${url} error: ${code}`,
      });

      return new HttpResponse({
        code,
        data,
        isSuccessful,
      });
    }
  },
};
