import { Storage as GCPStorage } from '@google-cloud/storage';
import { BlobServiceClient, generateBlobSASQueryParameters, BlobSASPermissions, StorageSharedKeyCredential } from '@azure/storage-blob';

const PROVIDER = process.env.STORAGE_PROVIDER || 'gcp';

// --- GCP Setup ---
let gcpStorage: GCPStorage | null = null;
if (PROVIDER === 'gcp') {
  const options: any = { projectId: process.env.GCP_PROJECT_ID };
  
  if (process.env.GCP_CLIENT_EMAIL && process.env.GCP_PRIVATE_KEY) {
    options.credentials = {
      client_email: process.env.GCP_CLIENT_EMAIL,
      private_key: process.env.GCP_PRIVATE_KEY?.replace(/^"|"(?=$)/g, '').replace(/\\n/g, '\n'),
    };
  }
  
  gcpStorage = new GCPStorage(options);
}
const GCP_BUCKET = process.env.GCP_BUCKET_NAME || '';

// --- Azure Setup ---
let azureClient: BlobServiceClient | null = null;
if (PROVIDER === 'azure') {
  azureClient = BlobServiceClient.fromConnectionString(process.env.AZURE_STORAGE_CONNECTION_STRING || '');
}
const AZURE_CONTAINER = process.env.AZURE_CONTAINER_NAME || '';

export async function uploadFile(buffer: Buffer, fileName: string, mimeType: string): Promise<string> {
  const uniqueName = `${Date.now()}-${fileName}`;

  if (PROVIDER === 'gcp' && gcpStorage) {
    const bucket = gcpStorage.bucket(GCP_BUCKET);
    const file = bucket.file(uniqueName);
    await file.save(buffer, {
      contentType: mimeType,
      resumable: false,
    });
    return uniqueName; // Using filename as key
  } else if (PROVIDER === 'azure' && azureClient) {
    const containerClient = azureClient.getContainerClient(AZURE_CONTAINER);
    const blockBlobClient = containerClient.getBlockBlobClient(uniqueName);
    await blockBlobClient.uploadData(buffer, {
      blobHTTPHeaders: { blobContentType: mimeType },
    });
    return uniqueName;
  }

  throw new Error('Invalid storage provider or provider not initialized properly.');
}

export async function deleteFile(filePath: string): Promise<void> {
  if (!filePath) return;

  if (PROVIDER === 'gcp' && gcpStorage) {
    const bucket = gcpStorage.bucket(GCP_BUCKET);
    const file = bucket.file(filePath);
    await file.delete({ ignoreNotFound: true });
  } else if (PROVIDER === 'azure' && azureClient) {
    const containerClient = azureClient.getContainerClient(AZURE_CONTAINER);
    const blockBlobClient = containerClient.getBlockBlobClient(filePath);
    await blockBlobClient.deleteIfExists();
  }
}

export async function getSignedUrl(filePath: string): Promise<string> {
  if (!filePath) return '';

  if (PROVIDER === 'gcp' && gcpStorage) {
    const bucket = gcpStorage.bucket(GCP_BUCKET);
    const file = bucket.file(filePath);
    const [url] = await file.getSignedUrl({
      version: 'v4',
      action: 'read',
      expires: Date.now() + 5 * 60 * 1000, // 5 minutes
    });
    return url;
  } else if (PROVIDER === 'azure' && azureClient) {
    // Extract credentials from connection string
    const connStr = process.env.AZURE_STORAGE_CONNECTION_STRING || '';
    const matchAccount = connStr.match(/AccountName=([^;]+)/);
    const matchKey = connStr.match(/AccountKey=([^;]+)/);

    if (matchAccount && matchKey) {
      const sharedKeyCredential = new StorageSharedKeyCredential(matchAccount[1], matchKey[1]);
      const containerClient = azureClient.getContainerClient(AZURE_CONTAINER);
      const blobClient = containerClient.getBlobClient(filePath);

      const sasOptions = {
        containerName: AZURE_CONTAINER,
        blobName: filePath,
        permissions: BlobSASPermissions.parse("r"),
        expiresOn: new Date(new Date().valueOf() + 5 * 60 * 1000),
      };

      const sasToken = generateBlobSASQueryParameters(sasOptions, sharedKeyCredential).toString();
      return `${blobClient.url}?${sasToken}`;
    }
  }

  return '';
}
