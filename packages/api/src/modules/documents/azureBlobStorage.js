// Multer storage engine that streams uploads straight into an Azure Blob Storage container.
const path = require('path');
const { BlobServiceClient } = require('@azure/storage-blob');

function AzureBlobStorage({ connectionString, container }) {
  this.container = container;
  this.connectionString = connectionString;
  this.containerClient = null;
}

// Created lazily so the API can boot (and tests can run) without storage credentials.
AzureBlobStorage.prototype._getContainer = function () {
  if (!this.containerClient) {
    if (!this.connectionString) {
      throw new Error('AZURE_STORAGE_CONNECTION_STRING is not set');
    }
    this.containerClient = BlobServiceClient
      .fromConnectionString(this.connectionString)
      .getContainerClient(this.container);
  }
  return this.containerClient;
};

AzureBlobStorage.prototype._handleFile = function (req, file, cb) {
  let blob;
  try {
    const filename = `${Date.now()}${path.extname(file.originalname)}`;
    blob = this._getContainer().getBlockBlobClient(filename);
  } catch (err) {
    return cb(err);
  }

  let size = 0;
  file.stream.on('data', (chunk) => { size += chunk.length; });

  blob
    .uploadStream(file.stream, undefined, undefined, {
      blobHTTPHeaders: { blobContentType: file.mimetype },
    })
    .then(() => cb(null, { filename: blob.name, path: blob.url, size }))
    .catch(cb);
};

AzureBlobStorage.prototype._removeFile = function (req, file, cb) {
  this._getContainer()
    .getBlockBlobClient(file.filename)
    .deleteIfExists()
    .then(() => cb(null))
    .catch(cb);
};

module.exports = (opts) => new AzureBlobStorage(opts);
