console.log("Hello World");

function convertToBinaryString(number) {
  let binary = number.toString(2);
  while (binary.length < 8) {
    binary = "0" + binary;
  }
  return binary;
}

// console.log(convertToBinaryString(16));
const dpi = window.devicePixelRatio;
const target = 300;

const image = document.getElementsByTagName("img")[0];
image.style.width = `${target}px`;
image.style.height = `${target}px`;

// hide the image
// image.style.display = "none";

// console.log(image);
const canvas = document.getElementsByTagName("canvas")[0];
const ctx = canvas.getContext("2d");

function copyToCanvas() {
  canvas.width = target * window.devicePixelRatio;
  canvas.height = target * window.devicePixelRatio;

  canvas.style.width = `${target}px`;
  canvas.style.height = `${target}px`;

  const img = new Image();
  img.src = image.src;
  canvas.imageSmoothingEnabled = false;
  ctx.drawImage(img, 0, 0, image.width * dpi, image.height * dpi);
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  console.log(imageData.data);
}

const compress_button = document.getElementById("compress");
compress_button.addEventListener("click", () => {
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  // //appply huffman coding
  const huffman = new HuffmanCoding(imageData.data);

  // //encode image data
  const encoded = huffman.encoded;
  console.log(encoded);

  // //make a string of encoded data
  const encodedString = encoded
    .map((byte) => {
      return byte.code;
    })
    .join("");

  console.log("Encoded string", encodedString);

  // //get 8 char long chunks of encoded data and convert to numbers
  const encodedData = [];
  for (let i = 0; i < encodedString.length; i += 8) {
    encodedData.push(parseInt(encodedString.slice(i, i + 8), 2));
  }

  console.log("Encoded data", encodedData);

  //store the data in a binary file
  const blob = new Blob([new Uint8Array(encodedData)], {
    type: "application/octet-stream",
  });

  //download the file
  const link = document.createElement("a");
  link.href = window.URL.createObjectURL(blob);
  link.download = "compressed.bin";
  link.click();
  document.body.appendChild(link);

  // const test = encodedData[0];

  //get binary value of test using inbuilt function
  // const bin = test.toString(2);
  // console.log(bin);

  // //get back the image from the array of numbers
// let binaryString = "";
// for (let i = 0; i < encodedData.length; i++) {
//   binaryString += convertToBinaryString(encodedData[i]);
// }

// console.log("Binary string", binaryString);


});



const decompress_button = document.getElementById("decompress");
decompress_button.addEventListener("click", () => {
  //get the file
  const file = document.getElementById("file").files[0];
  const reader = new FileReader();
  reader.readAsArrayBuffer(file);
  reader.onload = () => {
    const data = new Uint8Array(reader.result);
    console.log(data);
    //decode the data
  }
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
