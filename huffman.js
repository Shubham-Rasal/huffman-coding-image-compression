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
    this.tree = null;
    this.frequency = {};
    this.codes = {};
    this.encoded = "";
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
    sorted.forEach((node, index) => {
      nodes.push(new HuffmanNode(node[0], node[1], null, null));
    });

    const tree = this.buildTree(nodes);
    this.tree = tree;

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
      // this.codes[root.data] = { data: root.data, code: code };
      this.codes[root.data] = code;
      //   console.log(root)
    } else {
      this.buildCodes(root.left, code + "0");
      this.buildCodes(root.right, code + "1");
    }
  }

  encode() {
    // console.log(this.data.length)

    this.data.forEach((byte) => {
      this.encoded += this.codes[byte];
    });
  }

  decode() {
    //traverse tree and get data
    let current = this.getTree();
    let counter = 0;

    for (let i = 0; i < this.encoded.length; i++) {
      if (this.encoded[i] === "0") {
        current = current.left;
      } else {
        current = current.right;
      }

      if (current.left === null && current.right === null) {
        this.decoded.push(parseInt(current.data));
        current = this.getTree();
        counter++;
      }
    }

    console.log("Counter", counter);

    return this.decoded;
  }
}
