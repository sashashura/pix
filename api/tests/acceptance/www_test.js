const { spawn } = require('child_process');

describe('Acceptance | www', function () {
  describe('when starting', function () {
    it('should send port to stdout', function (done) {
      this.timeout(10000);
      const process = spawn('./www', [], { cwd: './bin', shell: true });

      process.stderr.on('data', (data) => {
        /*eslint-disable-next-line no-console*/
        console.error(`stderr: ${data}`);
      });

      process.stdout.on('data', (data) => {
        const message = data.toString();

        if (message.indexOf('Server running at' !== -1)) {
          done();
          process.kill('SIGINT');
        }
      });
    });
  });
});
