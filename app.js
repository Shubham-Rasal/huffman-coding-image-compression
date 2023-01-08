console.log("Hello World");
const zip = new JSZip();
console.log("zip", zip);

function convertToBinaryString(number) {
  let binary = number.toString(2);
  while (binary.length < 8) {
    binary = "0" + binary;
  }
  return binary;
}

function compress(string) {
  const remaining = string.length % 8;
  console.log(remaining);

  let extraCount = 8 - remaining;
  let extra = "";
  let i = extraCount;
  while (i--) extra += "0";
  string = string + extra;


  console.log(string.length % 8);

   // //get 8 char long chunks of encoded data and convert to numbers
   const encodedData = [];
   for (let i = 0; i < string.length; i += 8) {
     encodedData.push(parseInt(string.slice(i, i + 8), 2));
   }

   console.log("Encoded data from compress", encodedData);

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

  // console.log("Binary string", binaryString);

  binaryString = binaryString.slice(0, binaryString.length - extra);

  console.log("String after trimming : ", binaryString.length)
  return binaryString;

  
}

const image = document.getElementsByTagName("img")[0];
const canvas = document.getElementsByTagName("canvas")[0];
const ctx = canvas.getContext("2d");

let test = "";

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
  console.log("Encoded", encodedString);
  console.log("Encoded length", encodedString.length);


  //compress string 
  let {compressed , extra} = compress(encodedString);

  console.log("compressed :",compressed);


  const decompressedString = decompress(compressed , extra);
  console.log(decompressedString == encodedString)

  test = decompressedString



  //store the frequencies in a json file
  // huffman.frequency[256] = extra;
  // const frequencies = JSON.stringify(huffman.frequency);  
  
  console.log(huffman.frequency);

  const h2 = new HuffmanCoding(huffman.frequency, decompressedString, [])
  h2.getCodes();
  console.log(h2.codes)
  h2.decode();

  console.log("Decoded data", h2.decoded);


  // //decode image data
  huffman.decode();
  const decodedData = huffman.decoded;

  console.log("Decoded data", decodedData);

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

  //trim the array
  jsonFileData = jsonFileData.slice(0, 256);

  //reduce the size of the json
  // jsonFileData = JSON.parse(JSON.stringify(jsonFileData));

  console.log("json file data : ", jsonFileData);

  console.log("extra : " , extra)
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

  // const img = new Image();
  image.src = canvas.toDataURL("image/png");
  // document.body.appendChild(img);  


});

//get rgb values of each pixel
//print canvas width in px

// //get base64 encoded image data
// const base64 = canvas.toDataURL("image/png");
// //get image data as array of bytes
// const bytes = atob(base64.split(",")[1]);
// //convert to array of numbers
// const data = new Array(bytes.length);
// for (let i = 0; i < bytes.length; i++) {
//   data[i] = bytes.charCodeAt(i);
// }
// console.log(data);

// // convert back to number array
// const decodedData = [];
// for (let i = 0; i < binaryString.length; i += 8) {
//   decodedData.push(parseInt(binaryString.slice(i, i + 8), 2));
// }

// console.log("Decoded data", decodedData);

// huffman.decode();

// console.log(huffman.decoded);

// // change each data value by +5
// // for (let i = 0; i < huffman.decoded.length; i++) {
// //     huffman.decoded[i] = huffman.decoded[i] + 120 ;
// // }

// ctx.putImageData(
//   new ImageData(
//     new Uint8ClampedArray(huffman.decoded),
//     canvas.width,
//     canvas.height
//   ),
//   0,
//   0
// );

// const newImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
// console.log(newImageData.data);

// //get back the image from the array of numbers
// // const binary = data.map((byte) => {
// //     return String.fromCharCode(byte);
// // }
// // ).join('');
// // const base64String = btoa(binary);
// // const img2 = new Image();
// // img2.src = 'data:image/png;base64,' + base64String;
// // document.body.appendChild(img2);
