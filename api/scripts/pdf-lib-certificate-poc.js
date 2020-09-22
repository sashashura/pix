const { PDFDocument } = require('pdf-lib');
const fs = require('fs');
const fontkit = require('@pdf-lib/fontkit');

async function makePDF() {
  const pdfDoc = await PDFDocument.create();

  const fontBytes = fs.readFileSync(`${__dirname}/OpenSans-Bold.ttf`);

  // Register the `fontkit` instance
  pdfDoc.registerFontkit(fontkit);

  // Embed our custom font in the document
  const customFont = await pdfDoc.embedFont(fontBytes);

  const donorPdfBytes = fs.readFileSync(`${__dirname}/certif-base.pdf`);

  const donorPdfDoc = await PDFDocument.load(donorPdfBytes);

  const [page] = await pdfDoc.copyPages(donorPdfDoc, [0]);

  page.drawText('Mon texte à moi en plus', {
    x: 135, y: 415, font: customFont,
  });

  pdfDoc.addPage(page);

  const pdfBytes = await pdfDoc.save();

  fs.writeFileSync('certif.pdf', pdfBytes);
}

makePDF().then(()=>process.exit(0)).catch((err)=>{ console.error(err);process.exit(1); });
