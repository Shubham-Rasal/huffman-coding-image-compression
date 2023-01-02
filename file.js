

const input = document.querySelector('input');
const upload = document.querySelector('#upload');

const i = document.querySelector('.img');



upload.addEventListener('click', () => {
    console.log("uploading image....")
    const file = input.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    //display image
    reader.onload = () => {
        i.src = reader.result;
        //copy to canvas
        setTimeout(() => {
        copyToCanvas();
        }, 1000);
    }


})


