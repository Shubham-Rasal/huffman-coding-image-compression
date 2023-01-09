const zip = new JSZip();

function convertToBinaryString(number) {
  let binary = number.toString(2);
  while (binary.length < 8) {
    binary = "0" + binary;
  }
  return binary;
}

function compress(string) {
  const remaining = string.length % 8;

  let extraCount = 8 - remaining;
  let extra = "";
  let i = extraCount;
  while (i--) extra += "0";
  string = string + extra;



   // //get 8 char long chunks of encoded data and convert to numbers
   const encodedData = [];
   for (let i = 0; i < string.length; i += 8) {
     encodedData.push(parseInt(string.slice(i, i + 8), 2));
   }
  const data = {
    compressed : encodedData,
    extra : extraCount
  }

  return data;
}

function decompress(encodedData , extra) {

  //get back the image from the array of numbers
  let binaryString = "";
  for (let i = 0; i < encodedData.length; i++) {
    binaryString += convertToBinaryString(encodedData[i]);
  }

  binaryString = binaryString.slice(0, binaryString.length - extra);
  
}

const image = document.getElementsByTagName("img")[0];
const canvas = document.getElementsByTagName("canvas")[0];
const ctx = canvas.getContext("2d");


function copyToCanvas() {
  const img = new Image();
  img.src = image.src;
  canvas.imageSmoothingEnabled = false;
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  console.log(imageData.data);
}

const compress_button = document.getElementById("compress");
compress_button.addEventListener("click", async () => {
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  console.log(imageData);
  // //appply huffman coding
  const huffman = new HuffmanCoding([], "", imageData.data);

  huffman.getFrequency();
  huffman.getCodes();

  // //encode image data
  huffman.encode();
  const encodedString = huffman.encoded;

  //compress string 
  let {compressed , extra} = compress(encodedString);
  compressed = new Uint8Array(compressed);
 
  //store the compressed string in a bin file
  const blob = new Blob([compressed], {
    type: "application/octet-stream",
  });

  console.log("blob", blob);

  // //store the frequencies in a json file
  huffman.frequency[256] = extra;
  const frequencies = JSON.stringify(huffman.frequency);   

  const codesBlob = new Blob([frequencies], {
    type: "application/json",
  });

  // make a zip file of the binary file and the json file
  zip.file("compressed.bin", blob);
  zip.file("frequencies.json", codesBlob);
  const content = await zip.generateAsync({ type: "blob" });
  saveAs(content, "compressed.zip");

});

const decompress_button = document.getElementById("decompress");
decompress_button.addEventListener("click", async () => {
  
  const extra = jsonFileData[256];
  jsonFileData = jsonFileData.slice(0, 256);

  console.log("json file data : ", jsonFileData);

  const decompressedString = decompress(binaryFileData , extra);


  const h2 = new HuffmanCoding(jsonFileData, decompressedString, []);
  h2.getCodes();
  console.log(h2.codes)
  const d = h2.decode();
  console.log("Decoded data new   ", d);

  // add the data ot the canvas
  const reconstructedImageData = new ImageData(
    new Uint8ClampedArray(4 * canvas.width * canvas.height),
    canvas.width,
    canvas.height
  );

  for (let i = 0; i < d.length; i++) {
    reconstructedImageData.data[i] = d[i];
  }

  console.log("Reconstucted Image data : ", reconstructedImageData);

  const imageData = ctx.createImageData(canvas.width, canvas.height);
  imageData.data.set(reconstructedImageData.data);
  ctx.putImageData(imageData, 0, 0);

  image.src = canvas.toDataURL("image/png");


});
