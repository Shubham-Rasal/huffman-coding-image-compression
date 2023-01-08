

const input = document.querySelector('input');
const upload = document.querySelector('#upload');

const i = document.querySelector('.img');

let binaryFileData = null;
let jsonFileData = null;



upload.addEventListener('click', () => {
    console.log("uploading image....")
    if(input.files.length > 1) {
        handleMultipleFiles(input.files);
        return
    }
    const file = input.files[0];
    
    console.log(input.files)
    const reader = new FileReader();
    reader.readAsDataURL(file);
    //display image
    reader.onload = () => {
        i.src = reader.result;
        //copy to canvas
        setTimeout(() => {
        copyToCanvas();
        }, 100);
    }


})


function handleMultipleFiles(files){

    //check if type is octet-stream
    const file = files[0];
    const file2 = files[1];
    if(file.type === "application/octet-stream"){
        //read file 1
        const reader = new FileReader();
        reader.readAsArrayBuffer(file);
        reader.onload = () => {
            //parse as base64
            const data = new Uint8Array(reader.result);
            console.log(reader.result)
            console.log("binary file: ", data);
            binaryFileData = data; 
            
            
        }

        //read file 2
        const reader2 = new FileReader();
        reader2.readAsText(file2);
        reader2.onload = () => {
            const data = reader2.result;
            // console.log("text file: ", data);
            //convert to json
            const json = JSON.parse(data);
            console.log("json file: ", json);
            jsonFileData = json;
        }
    }

    //check if type is json
    if(file.type === "application/json"){
        //read file 1
        const reader = new FileReader();
        //read the jsno file
        reader.readAsBinaryString(file);
        reader.onload = () => {
            const data = reader.result;
            const json = JSON.parse(data);
            console.log("json file: ", json);
            jsonFileData = json;
        }

        //read file 2
        const reader2 = new FileReader();
        reader2.readAsArrayBuffer(file2);
        reader2.onload = () => {
            const data = new Uint8Array(reader2.result);
            console.log("binary file: ", data);
            binaryFileData = data;
            
        }
    }



}


