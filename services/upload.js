const upload = (file,usuario,firebase) => {
  let bucket = firebase.storage().bucket();

  firebase
    .storage()
    .bucket()
    .getFiles()
    .then(results => {
      const files = results[0];

      console.log('Files:');
      files.forEach(file => {
        console.log(file.name);
      });
    })
    .catch(err => {
      console.error('ERROR:', err);
    });
    
  let prom = new Promise((resolve, reject) => {
    if (!file) {
      reject('No image file');
    }
    let newFileName = `${usuario.id}_${Date.now()}`;

    let fileUpload = bucket.file(newFileName);
    fileUpload.createWriteStream({
      metadata: {
        contentType: "image/jpeg"
      },
      resumable:false
    })
      .on('error', function(err) {
        console.log("error en subida:",err);
        reject('Something is wrong! Unable to upload at the moment.');
      })
      .on('finish', function() {
        // The public URL can be used to directly access the file via HTTP.
        const url = format(`https://storage.googleapis.com/${bucket.name}/${fileUpload.name}`);
        resolve(url);
      })
      .end(file.buffer);
  });
  return prom;
}

module.exports.upload = upload;
