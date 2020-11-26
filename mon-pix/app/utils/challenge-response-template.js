export default class ChallengeResponseTemplate {

  constructor() {
    this._template = [];
    this._inputCount = 0;
  }

  addLineBreakIfIsNotLastLine({ lineIdx, lines }) {
    const isLastElement = lineIdx === (lines.length - 1);
    if (!isLastElement) {
      this._template.push({ breakline: true });
    }
  }

  add({ canAddBlockToTemplate, block }) {
    if (canAddBlockToTemplate) {
      this._template.push(block);
    }
  }

  incrementInputCount(isInputField) {
    if (isInputField) {
      this._inputCount++;
    }
  }

  get inputCount() {
    return this._inputCount;
  }

  get() {
    return this._template;
  }
}
