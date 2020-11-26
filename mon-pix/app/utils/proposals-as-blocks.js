import isEmpty from 'lodash/isEmpty';
import ResponseBlock from './response-block';

function parseInput(isInput, input) {
  let block;

  switch (input) {
    case '${':
      isInput = true;
      break;
    case undefined:
      isInput = false;
      break;
    case '':
      break;
    default:
      if (isInput) {
        block = new ResponseBlock({ input });
      }
      else {
        block = new ResponseBlock({ text: input });
      }
  }

  return { isInput, block };
}

function isLastElement(currentIdx, elements) {
  return currentIdx === (elements.length - 1);
}

function getLastLine(lines) {
  return lines[lines.length - 1];
}

function isAriaLabelNeededForInputs(lines) {
  const lastLine = getLastLine(lines);
  const inputStartRegex = /\${/g;
  const lastLineInputs = lastLine.match(inputStartRegex, '');
  const hasMoreThanOneInputField = lastLineInputs && lastLineInputs.length > 1;
  const inputRegex = /\s*(\${.+?})|-| /g; //regex that remove spaces, -, ${} => should return only letters
  const lastLineWithoutInput = lastLine.replace(inputRegex, '');
  const blocks = lastLine.split(/\s*(\${)|}\s*/);
  const hasNoTextBeforeInput = !(blocks && blocks[0].replace(inputRegex, '').length > 0);

  if (hasMoreThanOneInputField || hasNoTextBeforeInput) {
    return true;
  }

  return lastLineWithoutInput.length === 0;
}

function buildLineFrom(blocks, ariaLabelNeeded, challengeResponseTemplate) {
  let previousBlockText = '';
  for (let blockIdx = 0; blockIdx < blocks.length; blockIdx += 1) {
    const { isInput, block } = parseInput((isInput || false), blocks[blockIdx]);
    if (!block) {
      continue;
    }

    const isInputField = block.input != null;
    challengeResponseTemplate.incrementInputCount(isInputField);

    block.attachInputAndPlaceholderIfExist();
    const didAttachedLabel = block.attachLabel({
      isInputField,
      ariaLabelNeeded,
      previousBlockText,
      questionIdx: challengeResponseTemplate.inputCount });
    previousBlockText = didAttachedLabel ? '' : block.text;

    const canAddBlockToTemplate = ariaLabelNeeded || isInputField || isLastElement(blockIdx, blocks);
    challengeResponseTemplate.add({ canAddBlockToTemplate, block: block.get() });
  }
}

class ChallengeResponseTemplate {

  constructor() {
    this._template = [];
    this._inputCount = 0;
  }

  addLineBreakIfIsNotLastLine({ lineIdx, lines }) {
    if (!isLastElement(lineIdx, lines)) {
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

export default function proposalsAsBlocks(proposals) {

  if (isEmpty(proposals)) {
    return [];
  }

  const challengeResponseTemplate = new ChallengeResponseTemplate();
  const lines = proposals.split(/[\r|\n]+/).filter((line) => !isEmpty(line));
  const ariaLabelNeeded = isAriaLabelNeededForInputs(lines);

  lines.forEach((line, lineIdx) => {
    const blocks = line.split(/\s*(\${)|}\s*/);
    buildLineFrom(blocks, ariaLabelNeeded, challengeResponseTemplate);
    challengeResponseTemplate.addLineBreakIfIsNotLastLine({ lineIdx, lines });
  });
  return challengeResponseTemplate.get();
}
