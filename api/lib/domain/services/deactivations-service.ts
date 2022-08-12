// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  isDefault(deactivations: $TSFixMe) {
    if (!deactivations || (!deactivations.t1 && !deactivations.t2 && !deactivations.t3)) {
      return true;
    }
    return false;
  },

  hasOnlyT1(deactivations: $TSFixMe) {
    if (deactivations && deactivations.t1 && !deactivations.t2 && !deactivations.t3) {
      return true;
    }
    return false;
  },

  hasOnlyT1T2(deactivations: $TSFixMe) {
    if (deactivations && deactivations.t1 && deactivations.t2 && !deactivations.t3) {
      return true;
    }
    return false;
  },

  hasOnlyT2T3(deactivations: $TSFixMe) {
    if (deactivations && !deactivations.t1 && deactivations.t2 && deactivations.t3) {
      return true;
    }
    return false;
  },

  hasOnlyT1T3(deactivations: $TSFixMe) {
    if (deactivations && deactivations.t1 && !deactivations.t2 && deactivations.t3) {
      return true;
    }
    return false;
  },

  hasT1T2T3(deactivations: $TSFixMe) {
    if (deactivations && deactivations.t1 && deactivations.t2 && deactivations.t3) {
      return true;
    }
    return false;
  },

  hasOnlyT2(deactivations: $TSFixMe) {
    if (deactivations && deactivations.t2 && !deactivations.t1 && !deactivations.t3) {
      return true;
    }
    return false;
  },

  hasOnlyT3(deactivations: $TSFixMe) {
    if (deactivations && deactivations.t3 && !deactivations.t1 && !deactivations.t2) {
      return true;
    }
    return false;
  },
};
