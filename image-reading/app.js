const { createWorker } = require('tesseract.js'); //Tesseract (OCR)
const fs = require('fs'); //File Writing
const cv = require('opencvnodejs'); //OpenCV

async function openCVTest(imagePath){
  const img = await cv.imreadAsync(imagePath);
  console.log('Image dimensions:', img.rows, 'x', img.cols);
}


(async (imagePath) => {
  const worker = await createWorker();
  const { data: { text } } = await worker.recognize(imagePath); //Image file defined
  fs.writeFileSync('output.txt', text); //Output file defined
  await worker.terminate();
})(); //Take image and using OCR write text it to output file

const imagePath = 'images/simple_test.png'; // Path to the input image
readImageAndDisplayDimensions(imagePath);