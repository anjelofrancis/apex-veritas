// Jest mock for multer-cloud-storage (ESM package, incompatible with Jest CJS mode)
// This stub provides a minimal multer storage engine that stores files in memory during tests.
const { Readable } = require('stream');

function MockStorageEngine() {}

MockStorageEngine.prototype._handleFile = function (req, file, cb) {
  // Drain the stream and fake a successful upload
  const chunks = [];
  file.stream.on('data', (chunk) => chunks.push(chunk));
  file.stream.on('end', () => {
    cb(null, {
      filename: `${Date.now()}-${file.originalname}`,
      path: `gs://mock-bucket/${Date.now()}-${file.originalname}`,
      size: Buffer.concat(chunks).length,
    });
  });
  file.stream.on('error', cb);
};

MockStorageEngine.prototype._removeFile = function (req, file, cb) {
  cb(null);
};

module.exports = {
  storageEngine: function (opts) {
    return new MockStorageEngine();
  },
};
