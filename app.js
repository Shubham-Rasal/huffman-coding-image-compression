console.log("Hello World");

function convertToBinaryString(number) {
  let binary = number.toString(2);
  while (binary.length < 8) {
    binary = "0" + binary;
  }
  return binary;
}

console.log(convertToBinaryString(16));

class HuffmanNode {
  constructor(data, frequency, left, right) {
    this.data = data;
    this.frequency = frequency;
    this.left = left;
    this.right = right;
  }
}

class HuffmanCoding {
  constructor(data) {
    this.data = data;
    this.frequency = {};
    this.codes = {};
    this.encoded = [];
    this.decoded = [];
    this.getFrequency();
    this.getCodes();
    this.encode();
    this.decode();
    // this.getTree();
  }

  getFrequency() {
    this.data.forEach((byte) => {
      if (this.frequency[byte]) {
        this.frequency[byte]++;
      } else {
        this.frequency[byte] = 1;
      }
    });

    return this.frequency;
  }

  getTotalFrequency() {
    return Object.values(this.frequency).reduce((a, b) => {
      return a + b;
    });
  }

  getCodes() {
    const sorted = Object.entries(this.frequency).sort((a, b) => {
      return a[1] - b[1];
    });

    //convert to HuffmanNode
    let nodes = [];
    // console.log(sorted);
    sorted.forEach((node, index) => {
      nodes.push(new HuffmanNode(node[0], node[1], null, null));
    });
    // console.table(sorted);
    // console.log(this.getTotalFrequency());
    const tree = this.buildTree(nodes);
    // console.log(tree);

    this.buildCodes(tree);
  }

  buildTree(sorted) {
    //build tree until freqeusncy is equal to total frequency
    while (sorted[0].frequency < this.getTotalFrequency()) {
      //get first two nodes
      const left = sorted.shift();
      const right = sorted.shift();
      //create new node
      const newNode = new HuffmanNode(
        null,
        left.frequency + right.frequency,
        left,
        right
      );
      //insert new node in sorted array
      sorted.push(newNode);
      //sort array
      sorted.sort((a, b) => {
        return a.frequency - b.frequency;
      });
    }

    return sorted[0];
  }

  // getTree() {
  //   const tree = this.buildTree(this.data);
  //   console.log(tree);
  // }

  buildCodes(root, code = "") {
    if (root.data !== null) {
      this.codes[root.data] = { data: root.data, code: code };
      //   console.log(root)
    } else {
      this.buildCodes(root.left, code + "0");
      this.buildCodes(root.right, code + "1");
    }
  }

  encode() {
    this.data.forEach((byte) => {
      this.encoded.push(this.codes[byte]);
    });
  }

  decode() {
    this.decoded = this.encoded.map((item) => {
      //convert to integer
      return parseInt(item.data);
    });
  }
}



const image = document.getElementsByTagName("img")[0];
console.log(image);

//set image width and height to match the actual image size
image.width = image.naturalWidth * 0.5;
image.height = image.naturalHeight * 0.5;

const canvas = document.getElementsByTagName("canvas")[0];
canvas.width = image.naturalWidth * 0.5;
canvas.height = image.naturalHeight * 0.5;
const dpi = window.devicePixelRatio;

const ctx = canvas.getContext("2d");


function fix_dpi() {
  //create a style object that returns width and height
  let style = {
    height() {
      return +getComputedStyle(canvas).getPropertyValue("height").slice(0, -2);
    },
    width() {
      return +getComputedStyle(canvas).getPropertyValue("width").slice(0, -2);
    },
  };
  //set the correct attributes for a crystal clear image!
  canvas.setAttribute("width", style.width() * dpi);
  canvas.setAttribute("height", style.height() * dpi);
}

// fix_dpi();





const img = new Image();
img.src = image.src;
canvas.imageSmoothingEnabled = false;
ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

//get rgb values of each pixel
const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
//print canvas width in px

console.log(imageData.data);

// const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
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

// //get back the image from the array of numbers
let binaryString = "";
for (let i = 0; i < encodedData.length; i++) {
  binaryString += convertToBinaryString(encodedData[i]);
}

console.log("Binary string", binaryString);

// convert back to number array
const decodedData = [];
for (let i = 0; i < binaryString.length; i += 8) {
  decodedData.push(parseInt(binaryString.slice(i, i + 8), 2));
}

console.log("Decoded data", decodedData);

huffman.decode();

console.log(huffman.decoded);

// change each data value by +5
// for (let i = 0; i < huffman.decoded.length; i++) {
//     huffman.decoded[i] = huffman.decoded[i] + 120 ;
// }

ctx.putImageData(
  new ImageData(
    new Uint8ClampedArray(huffman.decoded),
    canvas.width,
    canvas.height
  ),
  0,
  0
);

const newImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
console.log(newImageData.data);

//get back the image from the array of numbers
// const binary = data.map((byte) => {
//     return String.fromCharCode(byte);
// }
// ).join('');
// const base64String = btoa(binary);
// const img2 = new Image();
// img2.src = 'data:image/png;base64,' + base64String;
// document.body.appendChild(img2);
