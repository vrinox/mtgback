const upload = (file,usuario,firebase) => {
  let bucket = firebase.storage().bucket();
  let prom = new Promise((resolve, reject) => {
    if (!file) {
      reject('No image file');
    }
    let newFileName = `${avatar}${usuario.id}_${Date.now()}`;
    let fileUpload = bucket.file(newFileName+'.jpg');

    fileUpload
    .save(new Buffer(file.buffer))
    .then((result) => {
      console.log("resultado",result);
      resolve({
        status: 'success',
        data: Object.assign({}, fileUpload.metadata, {
          downloadURL: `https://storage.googleapis.com/${bucket.name}/${newFileName}`,
        })
      });
    })
    .catch(err => {
      console.log("error en subida:",err);
      reject(err)
    });
  });
  return prom;
}

module.exports.upload = upload;
