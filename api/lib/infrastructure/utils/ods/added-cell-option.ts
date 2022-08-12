// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = class AddedCellOption {
  colspan: $TSFixMe;
  labels: $TSFixMe;
  positionOffset: $TSFixMe;
  rowspan: $TSFixMe;
  constructor({ labels = [], rowspan = 0, colspan = 0, positionOffset = 0 }) {
    this.labels = labels;
    this.rowspan = rowspan;
    this.colspan = colspan;
    this.positionOffset = positionOffset;
  }
};
