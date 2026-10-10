// Jest mock for the Azure Blob storage engine: drains uploads in memory instead of calling Azure.
function MockStorageEngine() {}

MockStorageEngine.prototype._handleFile = function (req, file, cb) {
  // Drain the stream and fake a successful upload
  const chunks = [];
  file.stream.on('data', (chunk) => chunks.push(chunk));
  file.stream.on('end', () => {
    const filename = `${Date.now()}-${file.originalname}`;
    cb(null, {
      filename,
      path: `https://mock.blob.core.windows.net/documents/${filename}`,
      size: Buffer.concat(chunks).length,
    });
  });
  file.stream.on('error', cb);
};

MockStorageEngine.prototype._removeFile = function (req, file, cb) {
  cb(null);
};

module.exports = () => new MockStorageEngine();
