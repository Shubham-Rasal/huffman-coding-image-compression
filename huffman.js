class HuffmanNode {
  constructor(data, frequency, left, right) {
    this.data = data;
    this.frequency = frequency;
    this.left = left;
    this.right = right;
  }
}

class HuffmanCoding {
  
  constructor(frequencies , encoded , data){
    this.data = data;
    this.tree = null;
    this.codes = {};
    this.decoded = [];
    this.frequency = frequencies;
    this.encoded = encoded;
  }

  getFrequency() {
    // one equal sign makes all the difference
    for(let i = 0;i < 256;i++){
      this.frequency[i] = 0;
    }

    console.log(this.frequency)

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
    
    //using heap (min heap)
    const sorted = Object.entries(this.frequency).sort((a, b) => {
      return a[1] - b[1];
    });

    //convert to HuffmanNode using the concept of min heap
    let nodes = [];
    sorted.forEach((node, index) => {
      nodes.push(new HuffmanNode(node[0], node[1], null, null));
    });

    const tree = this.buildTree(nodes);
    this.tree = tree;
    console.log(tree);

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

  //get tree
  getTree() {
    return this.tree;
  }

  buildCodes(root, code = "") {
    if (root.data !== null) {
      this.codes[root.data] = code;
    } else {
      this.buildCodes(root.left, code + "0");
      this.buildCodes(root.right, code + "1");
    }
  }

  encode() {
    this.data.forEach((byte) => {
      this.encoded += this.codes[byte];
    });
  }

  decode() {
    //traverse tree and get data

    console.log(this.encoded);

    let current = this.getTree();

    
    for (let i = 0; i < this.encoded.length; i++) {
      if (this.encoded[i] === "0") {
        current = current.left;
      } else {
        current = current.right;
      }

      if (current.left === null && current.right === null) {
        this.decoded.push(parseInt(current.data));
        current = this.getTree();
        // counter++;
      }
    }


    return this.decoded;
  }
}
