const { PDFDocument, rgb } = require('pdf-lib');
const fs = require('fs');
const fontkit = require('@pdf-lib/fontkit');
const faker = require('faker');

async function makePDF() {
  const pdfDoc = await PDFDocument.create();

  // Register the `fontkit` instance
  pdfDoc.registerFontkit(fontkit);

  // Embed our custom fonts in the document
  const scoreFont = await pdfDoc.embedFont(fs.readFileSync(`${__dirname}/OpenSans-Bold.ttf`));
  const levelFont = await pdfDoc.embedFont(fs.readFileSync(`${__dirname}/Roboto-Medium.ttf`));
  const codeFont = await pdfDoc.embedFont(fs.readFileSync(`${__dirname}/RobotoMono-Regular.ttf`));
  const headerFont = scoreFont;

  const basePdfBytes = fs.readFileSync(`${__dirname}/certif-base.pdf`);

  const basePdfDoc = await PDFDocument.load(basePdfBytes);

  const [page] = await pdfDoc.copyPages(basePdfDoc, [0]);

  const headerFontSize = 9;
  const scoreFontSize = 24;
  const levelFontSize = 9;
  const codeFontSize = 11;

  const score = Math.floor(Math.random() * 640).toString();

  const scoreWidth = scoreFont.widthOfTextAtSize(score, scoreFontSize);

  page.drawText(score, {
    x: 105 - scoreWidth / 2, y: 675,
    font: scoreFont,
    size: scoreFontSize,
  });

  const fullName = `${faker.name.firstName()} ${faker.name.lastName()}`;
  const birthInfo = '28 juin 1976 à Paris';
  const certifCenter = 'Université Nice-Sophia-Artpolis';
  const certifDate = '26 décembre 2019';

  [
    [ 230, 712, fullName ],
    [ 269, 696, birthInfo ],
    [ 257, 680, certifCenter ],
    [ 208, 664, certifDate ],
  ].forEach(([x, y, text]) => {
    page.drawText(text, {
      x, y,
      font: headerFont,
      size: headerFontSize,
      color: rgb(26 / 255, 64 / 255, 109 / 255),
    });
  });

  const code = `P-${1000000 + Math.floor(Math.random() * 900000)}`;

  page.drawText(code, {
    x: 414, y: 554,
    font: codeFont,
    size: codeFontSize,
    color: rgb(1, 1, 1),
  });

  [
    556, 532, 508,
    452, 428, 404, 380,
    324, 300, 276, 252,
    196, 172, 148,
    92, 68,
  ].forEach((y) => {
    const level = Math.max(Math.floor(Math.random() * 7) - 1, 0);

    if (level > 0) {
      page.drawText(level.toString(), {
        x: 291, y: y + 5,
        font: levelFont,
        size: levelFontSize,
        color: rgb(37 / 255, 56 / 255, 88 / 255),
      });
    } else {
      page.drawRectangle({
        x: 65,
        y,
        width: 210,
        height: 18,
        color: rgb(1, 1, 1),
        opacity: 0.5,
      });
    }
  });

  pdfDoc.addPage(page);

  const pdfBytes = await pdfDoc.save();

  fs.writeFileSync('certif.pdf', pdfBytes);
}

makePDF().then(()=>process.exit(0)).catch((err)=>{ console.error(err);process.exit(1); });
