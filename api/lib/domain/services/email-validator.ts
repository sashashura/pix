// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  emailIsValid(email: $TSFixMe) {
    if (!email) {
      return false;
    }
    // Source: http://stackoverflow.com/a/46181/5430854
    const pattern =
      /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i;

    return pattern.test(email.trim());
  },
};
