// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, catchErr } = require('../../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'getCsvCont... Remove this comment to see the full error message
const { getCsvContent } = require('../../../../../lib/infrastructure/utils/csv/write-csv-utils');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'CsvParsing... Remove this comment to see the full error message
const { CsvParsingError } = require('../../../../../lib/domain/errors');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Integration | Infrastructure | Utils | csv | write-csv-utils', function () {
  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('should return a csv content according to fileHeaders data', async function () {
    // given
    const data = {
      firstName: 'Julie',
      lastName: 'Dupont',
      competenceWithMarks: [
        {
          1.1: 0,
        },
        {
          1.2: 2,
        },
      ],
    };
    const fileHeaders = ['firstName', 'competenceWithMarks'];

    // when
    const result = await getCsvContent({ data, fileHeaders });

    // then
    const expectedResult = '\uFEFF' + '"firstName";"competenceWithMarks"\n' + '"Julie";"[{""1.1"":0},{""1.2"":2}]"';
    expect(result).to.deep.equal(expectedResult);
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('should throw an error if data is not json', async function () {
    // given
    const data = undefined;

    // when
    // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
    const result = await catchErr(getCsvContent)({ data });

    // then
    expect(result).to.be.instanceOf(CsvParsingError);
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('should throw an error if fileHeaders is not an array', async function () {
    // given
    const data = { firstName: 'Lili' };
    const fileHeaders = 1234;

    // when
    // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
    const result = await catchErr(getCsvContent)({ data, fileHeaders });

    // then
    expect(result).to.be.instanceOf(CsvParsingError);
  });
});
