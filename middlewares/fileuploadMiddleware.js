require('dotenv').config()
const { Storage } = require('@google-cloud/storage');
const storage = new Storage({ keyFilename: process.env.KEYFILE });
const bucket = storage.bucket(process.env.BUCKET);


function getTime() {
    var today = new Date().toLocaleDateString()
    today = today.toString().replace('/', '-')
    today = today.replace('/', '-')

    const date = new Date();
    let h = date.getHours();
    let m = date.getMinutes();
    let s = date.getSeconds();

    today += '-' + h + '-' + m + '-' + s

    return today + "-";
}




// google cloud
exports.uploadImage = (file) => new Promise((resolve, reject) => {
    const { originalname, buffer } = file
    let fname = originalname.replace(originalname, getTime() + originalname)
    fname = fname.split(' ').join('_');
    fname = fname.split('/').join('_');
    fname = "blog"+fname
    const blob = bucket.file(fname)
    const blobStream = blob.createWriteStream({
        resumable: false
    })
    blobStream.on('finish', () => {
        const publicUrl = 'https://storage.googleapis.com/' + process.env.BUCKET + '/' + fname
        resolve(publicUrl)
    }).on('error', () => {
        reject(`Unable to upload image, something went wrong`)
    }).end(buffer)
})



//delete
// exports.deleteImage = (filename) => new Promise((resolve, reject) => {
//     let fname = filename;
//     let fnames = fname.split('canteen-assets');
//     let x = fnames[1].substring(fnames[1].length, 1);
//     storage
//         .bucket(process.env.BUCKET)
//         .file(x)
//         .delete()
//         .then((image) => {
//             resolve(image)
//         })
//         .catch((e) => {
//             reject(e)
//         });
// })
