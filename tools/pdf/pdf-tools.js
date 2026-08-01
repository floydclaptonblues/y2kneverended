const fileInput = document.getElementById('pdfFiles');
const status = document.getElementById('pdfStatus');

function requireLibrary() {
  if (!window.PDFLib) throw new Error('The PDF library did not load. Check the internet connection and reload the page.');
  return window.PDFLib;
}

function selectedFiles() {
  const files = [...fileInput.files];
  if (!files.length) throw new Error('Choose at least one PDF file.');
  return files;
}

async function bytesFor(file) {
  return new Uint8Array(await file.arrayBuffer());
}

function downloadPdf(bytes, filename) {
  const blob = new Blob([bytes], { type: 'application/pdf' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
  setTimeout(() => URL.revokeObjectURL(link.href), 1000);
}

function parsePageRange(text, pageCount) {
  const cleaned = text.trim();
  if (!cleaned) throw new Error('Enter pages to extract, such as 1-3, 6, 9-11.');
  const pages = new Set();

  cleaned.split(',').map((part) => part.trim()).filter(Boolean).forEach((part) => {
    const range = part.match(/^(\d+)\s*-\s*(\d+)$/);
    if (range) {
      const start = Number(range[1]);
      const end = Number(range[2]);
      if (start < 1 || end < 1 || start > end || end > pageCount) {
        throw new Error(`Invalid page range: ${part}. This PDF has ${pageCount} page(s).`);
      }
      for (let page = start; page <= end; page += 1) pages.add(page - 1);
      return;
    }

    if (!/^\d+$/.test(part)) throw new Error(`Invalid page entry: ${part}`);
    const page = Number(part);
    if (page < 1 || page > pageCount) throw new Error(`Page ${page} is outside this ${pageCount}-page PDF.`);
    pages.add(page - 1);
  });

  return [...pages].sort((a, b) => a - b);
}

async function mergePdfs() {
  const { PDFDocument } = requireLibrary();
  const files = selectedFiles();
  status.textContent = `Merging ${files.length} file(s)…`;
  const output = await PDFDocument.create();

  for (const file of files) {
    const source = await PDFDocument.load(await bytesFor(file));
    const copied = await output.copyPages(source, source.getPageIndices());
    copied.forEach((page) => output.addPage(page));
  }

  const result = await output.save();
  downloadPdf(result, 'y2k-merged.pdf');
  status.textContent = `Merged ${files.length} PDF file(s) into ${output.getPageCount()} page(s).`;
}

async function extractPages() {
  const { PDFDocument } = requireLibrary();
  const [file] = selectedFiles();
  status.textContent = 'Reading selected pages…';
  const source = await PDFDocument.load(await bytesFor(file));
  const indices = parsePageRange(document.getElementById('pageRange').value, source.getPageCount());
  const output = await PDFDocument.create();
  const copied = await output.copyPages(source, indices);
  copied.forEach((page) => output.addPage(page));
  const result = await output.save();
  downloadPdf(result, 'y2k-extracted-pages.pdf');
  status.textContent = `Extracted ${indices.length} page(s) from ${file.name}.`;
}

async function rotatePdf() {
  const { PDFDocument, degrees } = requireLibrary();
  const [file] = selectedFiles();
  const amount = Number(document.getElementById('rotation').value);
  status.textContent = `Rotating ${file.name}…`;
  const documentPdf = await PDFDocument.load(await bytesFor(file));
  documentPdf.getPages().forEach((page) => {
    const existing = page.getRotation().angle || 0;
    page.setRotation(degrees((existing + amount) % 360));
  });
  const result = await documentPdf.save();
  downloadPdf(result, 'y2k-rotated.pdf');
  status.textContent = `Rotated ${documentPdf.getPageCount()} page(s) by ${amount}°.`;
}

async function run(action) {
  try {
    await action();
  } catch (error) {
    console.error(error);
    status.textContent = error.message || 'The PDF operation failed.';
  }
}

document.getElementById('mergeButton').addEventListener('click', () => run(mergePdfs));
document.getElementById('extractButton').addEventListener('click', () => run(extractPages));
document.getElementById('rotateButton').addEventListener('click', () => run(rotatePdf));
fileInput.addEventListener('change', () => {
  const files = [...fileInput.files];
  status.textContent = files.length ? `${files.length} PDF file(s) selected.` : 'Choose a PDF to begin.';
});
