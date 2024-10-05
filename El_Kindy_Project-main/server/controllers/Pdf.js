import PdfPrinter from 'pdfmake';
import fs from 'fs';
import path from 'path';

// Define font files
const fonts = {
  Roboto: {
    normal: 'fonts/Roboto-Regular.ttf',
    bold: 'fonts/Roboto-Medium.ttf',
    italics: 'fonts/Roboto-Italic.ttf',
    bolditalics: 'fonts/Roboto-MediumItalic.ttf'
  }
};

const printer = new PdfPrinter(fonts);

const generatePdf = (docDefinition, fileName) => {
  return new Promise((resolve, reject) => {
    const pdfDoc = printer.createPdfKitDocument(docDefinition);
    const filePath = path.join(__dirname, 'path_to_save', fileName); 
    const stream = fs.createWriteStream(filePath);
    let errorOccurred = false;

    pdfDoc.pipe(stream);
    pdfDoc.on('finish', () => {
      if (!errorOccurred) resolve(filePath);
    });
    pdfDoc.on('error', err => {
      errorOccurred = true;
      fs.unlink(filePath, () => {}); // Attempt to delete the file on error
      reject(err);
    });
    pdfDoc.end();
  });
};

const generateInvoice = async (reservationDetails) => {
  const docDefinition = {
    content: [
      { text: 'Invoice', style: 'header' },
      {
        style: 'tableExample',
        table: {
          body: [
            ['Event', reservationDetails.eventName],
            ['Date', reservationDetails.eventDate],
            ['Name', reservationDetails.userName],
            ['Email', reservationDetails.userEmail],
            ['Price', reservationDetails.price],
          ]
        }
      },
    ],
    styles: {
      header: {
        fontSize: 18,
        bold: true
      },
      tableExample: {
        margin: [0, 5, 0, 15]
      }
    }
  };

  return await generatePdf(docDefinition, `invoice_${reservationDetails.reservationId}.pdf`);
};

export { generateInvoice };

