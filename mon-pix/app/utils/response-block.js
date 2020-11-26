export default class ResponseBlock {

  constructor({ input, text, placeholder }) {
    this._input = input;
    this._text = text;
    this._placeholder = placeholder;
    this._ariaLabel = null;
  }

  attachInputAndPlaceholderIfExist() {
    if (this._input && stringHasPlaceholder(this._input)) {
      const inputParts = this._input.split('#');
      this._input = inputParts[0];
      this._placeholder = inputParts[1];
    }
  }

  attachLabel({ isInputField, ariaLabelNeeded, previousBlockText, questionIdx }) {
    if (!isInputField) {
      return false;
    }
    if (!ariaLabelNeeded
      && this._hasPreviousBlockText(previousBlockText)) {
      this._text = previousBlockText;
    }
    else {
      this._ariaLabel = 'Réponse ' + questionIdx;
    }
    return true;
  }

  _hasPreviousBlockText(previousBlockText) {
    return !(previousBlockText.trim().length === 1 && previousBlockText[0] === '-');
  }

  get input() {
    return this._input;
  }

  get text() {
    return this._text;
  }

  get() {
    return {
      input: this._input,
      text: this._text,
      placeholder: this._placeholder,
      ariaLabel: this._ariaLabel,
    };
  }
}

function stringHasPlaceholder(input) {
  return 1 <= input.indexOf('#');
}
