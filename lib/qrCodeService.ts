// QR Code service for generating QR codes for item tracking
// Uses qrcode library to generate QR codes containing serial numbers

export async function generateQRCode(serialNumber: string): Promise<string> {
  try {
    // This will generate a QR code as a data URL
    // The QR code contains only the serial number
    const qrcode = await import('qrcode');
    const dataUrl = await qrcode.toDataURL(serialNumber, {
      width: 300,
      margin: 1,
      color: {
        dark: '#000000',
        light: '#FFFFFF',
      },
    });
    return dataUrl;
  } catch (error) {
    console.error('Error generating QR code:', error);
    throw error;
  }
}

/**
 * Generate multiple QR codes for batch printing
 */
export async function generateQRCodesBatch(
  serialNumbers: string[]
): Promise<Record<string, string>> {
  const codes: Record<string, string> = {};

  for (const serialNumber of serialNumbers) {
    try {
      const qrcode = await import('qrcode');
      codes[serialNumber] = await qrcode.toDataURL(serialNumber, {
        width: 200,
        margin: 0.5,
      });
    } catch (error) {
      console.error(`Error generating QR code for ${serialNumber}:`, error);
    }
  }

  return codes;
}

/**
 * Generate printable QR sheet HTML
 */
export function generatePrintableQRSheet(
  codes: Record<string, string>,
  productName: string
): string {
  const qrCodes = Object.entries(codes);
  const rows = [];

  for (let i = 0; i < qrCodes.length; i += 3) {
    const row = qrCodes.slice(i, i + 3);
    rows.push(row);
  }

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>QR Codes - ${productName}</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 20px;
          }
          .header {
            text-align: center;
            margin-bottom: 30px;
          }
          .qr-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 20px;
            margin-bottom: 20px;
          }
          .qr-item {
            text-align: center;
            page-break-inside: avoid;
            border: 1px solid #ddd;
            padding: 10px;
            border-radius: 4px;
          }
          .qr-item img {
            width: 200px;
            height: 200px;
            margin-bottom: 10px;
          }
          .serial-number {
            font-weight: bold;
            font-size: 12px;
            word-break: break-all;
          }
          @media print {
            body {
              margin: 0;
              padding: 10px;
            }
            .qr-grid {
              gap: 10px;
            }
            .qr-item {
              padding: 5px;
            }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>${productName} - QR Codes</h1>
          <p>Generated: ${new Date().toLocaleString()}</p>
          <p>Total Items: ${qrCodes.length}</p>
        </div>
        <div class="qr-grid">
          ${qrCodes
            .map(
              ([serialNumber, dataUrl]) => `
            <div class="qr-item">
              <img src="${dataUrl}" alt="QR Code for ${serialNumber}">
              <div class="serial-number">${serialNumber}</div>
            </div>
          `
            )
            .join('')}
        </div>
      </body>
    </html>
  `;

  return html;
}

/**
 * Download QR sheet as PDF
 */
export async function downloadQRSheetAsPDF(
  codes: Record<string, string>,
  productName: string
): Promise<void> {
  try {
    const html = generatePrintableQRSheet(codes, productName);
    const newWindow = window.open('', '', 'width=800,height=600');

    if (newWindow) {
      newWindow.document.write(html);
      newWindow.document.close();

      // Trigger print dialog
      newWindow.print();
    }
  } catch (error) {
    console.error('Error downloading QR sheet:', error);
    throw error;
  }
}
