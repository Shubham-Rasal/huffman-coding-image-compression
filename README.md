# huffman-coding-image-compression

This is a simple implementation of Huffman coding for image compression. The code is written in Javascript and is based on the [Huffman coding](https://en.wikipedia.org/wiki/Huffman_coding) Wikipedia article.

## Implementation

The implementation is based on the following steps:

1. Read the image data from the image file.
2. Count the number of occurrences of each pixel value.
3. Build a Huffman tree based on the pixel value occurrences.
4. Encode the image data using the Huffman tree.
5. Write the encoded data to a binary file.
6. Decode the encoded data using the Huffman tree.
7. Write the decoded data to a new image file.


## Details

> The following is a brief description of the implementation. For more details, please refer to the code comments.

### Read the image data from the image file

The image data is read from the image file using the canvas `getImageData` method. The image data is stored in a `Uint8ClampedArray` object.

```javascript

const canvas = document.createElement('canvas');
const context = canvas.getContext('2d');
const image = new Image();
image.src = 'image.png';

```

### Count the number of occurrences of each pixel value

The number of occurrences of each pixel value is counted using an array of 256 elements. Each element in the array represents a pixel value. The value of the element is the number of occurrences of the pixel value.

```javascript

const pixelCounts = new Array(256).fill(0);
for (let i = 0; i < imageData.length; i += 4) {
  const pixelValue = imageData[i];
  pixelCounts[pixelValue]++;
}

```

### Build a Huffman tree based on the pixel value occurrences

The Huffman tree is built using a priority queue. The priority queue is implemented using a binary heap. The priority queue is initialized with the pixel values and their occurrences. The priority queue is then used to build the Huffman tree.

In this project the Huffman tree is built using the [Greedy algorithm](https://en.wikipedia.org/wiki/Greedy_algorithm). The algorithm is implemented in the `buildTree` function.

The Huffman tree is represented using a binary tree. Each node in the tree represents a pixel value or a combination of pixel values. The leaf nodes represent the pixel values. The non-leaf nodes represent the combination of pixel values. The combination of pixel values is represented using a string of pixel values separated by a comma. The combination of pixel values is stored in the `value` property of the node. The number of occurrences of the combination of pixel values is stored in the `frequency` property of the node.

```javascript

const huffmanTree = buildTree(pixelCounts);

```

### Encode the image data using the Huffman tree

The image data is encoded using the Huffman tree. The encoding is implemented in the `encode` function. The encoding is represented using a string of 0s and 1s. The string is then converted to an array of 8 bit integers.
The encoding is stored in a `Uint8Array` object.

```javascript

const encodedData = encode(imageData, huffmanTree);

```


### Write the encoded data to a binary file

The encoded data is written to a binary file using the blob `arrayBuffer` method. The encoded data is stored in a `Uint8Array` object.
It is then written into a binary file using th   [jszip](https://stuk.github.io/jszip/) library.

```javascript

const blob = new Blob([encodedData.buffer], { type: 'application/octet-stream' });
const zip = new JSZip();
zip.file('encoded.bin', blob);
zip.generateAsync({ type: 'blob' }).then((content) => {
  saveAs(content, 'encoded.zip');
});

```

### Decode the encoded data using the Huffman tree

The encoded data is decoded using the Huffman tree. The decoding is implemented in the `decode` function. The decoding is represented using a `Uint8ClampedArray` object.

Along with the binary file, the decode function needs the frequency table which is provided as a json file. The frequency table is used to build the Huffman tree.

`The decoding works as follows:`
1. The encoded data is read from the binary file.
2. The encoded data is converted to a string of 0s and 1s.
3. The string of 0s and 1s is decoded using the Huffman tree.
4. The decoded data is stored in a `Uint8ClampedArray` object.


### Write the decoded data to a new image file

The decoded data is written to a new image file using the canvas `putImageData` method. The decoded data is stored in a `Uint8ClampedArray` object.

```javascript

const canvas = document.createElement('canvas');
const context = canvas.getContext('2d');
const imageData = context.createImageData(width, height);
imageData.data.set(decodedData);

```








