const { expect } = require('../../test-helper');
const { stdout } = require('test-console');
const logger = require('../../../lib/infrastructure/logger');

describe('Unit | Infrastructure | logger', function () {
  describe('#info', function () {
    it('should send message to stdout', async function () {
      // when
      // eslint-disable-next-line no-sync
      const output = stdout.inspectSync(() => {
        logger.info('foo');
      });

      // then
      expect(output).to.deep.equal(['foo']);
    });
  });
});
