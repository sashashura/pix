// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'OK'.
const OK = 'ok';
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'KO'.
const KO = 'ko';
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'SKIPPED'.
const SKIPPED = 'aband';
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'TIMEDOUT'.
const TIMEDOUT = 'timedout';
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'FOCUSEDOUT... Remove this comment to see the full error message
const FOCUSEDOUT = 'focusedOut';
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'PARTIALLY'... Remove this comment to see the full error message
const PARTIALLY = 'partially';
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'UNIMPLEMEN... Remove this comment to see the full error message
const UNIMPLEMENTED = 'unimplemented';

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'AnswerStat... Remove this comment to see the full error message
class AnswerStatus {
  status: $TSFixMe;
  constructor({
    status
  }: $TSFixMe = {}) {
    // TODO: throw a BadAnswerStatus error if the status is bad + adapt the tests
    this.status = status;
  }

  /* PUBLIC INTERFACE */
  isFailed() {
    return this.status !== OK;
  }

  isOK() {
    return this.status === OK;
  }
  isKO() {
    return this.status === KO;
  }
  isSKIPPED() {
    return this.status === SKIPPED;
  }
  isTIMEDOUT() {
    return this.status === TIMEDOUT;
  }
  isFOCUSEDOUT() {
    return this.status === FOCUSEDOUT;
  }
  isPARTIALLY() {
    return this.status === PARTIALLY;
  }
  isUNIMPLEMENTED() {
    return this.status === UNIMPLEMENTED;
  }

  /* PUBLIC CONSTRUCTORS */
  static get OK() {
    return new AnswerStatus({ status: OK });
  }
  static get KO() {
    return new AnswerStatus({ status: KO });
  }
  static get SKIPPED() {
    return new AnswerStatus({ status: SKIPPED });
  }
  static get TIMEDOUT() {
    return new AnswerStatus({ status: TIMEDOUT });
  }
  static get FOCUSEDOUT() {
    return new AnswerStatus({ status: FOCUSEDOUT });
  }
  static get PARTIALLY() {
    return new AnswerStatus({ status: PARTIALLY });
  }
  static get UNIMPLEMENTED() {
    return new AnswerStatus({ status: UNIMPLEMENTED });
  }

  /* METHODES DE TRANSITION */
  static isFailed(otherResult: $TSFixMe) {
    return AnswerStatus.from(otherResult).isFailed();
  }
  static isOK(otherResult: $TSFixMe) {
    return AnswerStatus.from(otherResult).isOK();
  }
  static isKO(otherResult: $TSFixMe) {
    return AnswerStatus.from(otherResult).isKO();
  }
  static isSKIPPED(otherResult: $TSFixMe) {
    return AnswerStatus.from(otherResult).isSKIPPED();
  }
  static isPARTIALLY(otherResult: $TSFixMe) {
    return AnswerStatus.from(otherResult).isPARTIALLY();
  }
  static isFOCUSEDOUT(otherResult: $TSFixMe) {
    return AnswerStatus.from(otherResult).isFOCUSEDOUT();
  }

  /* PRIVATE */
  static from(other: $TSFixMe) {
    if (other instanceof AnswerStatus) {
      return other;
    } else {
      return new AnswerStatus({ status: other });
    }
  }
}

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = AnswerStatus;
