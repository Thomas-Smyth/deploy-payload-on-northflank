import { buildConfig } from 'payload/config';
import { cloudStorage } from '@payloadcms/plugin-cloud-storage';
import { s3Adapter } from '@payloadcms/plugin-cloud-storage/s3';
import path from 'path';
import Examples from './collections/Examples';
import Users from './collections/Users';

export default buildConfig({
  serverURL: process.env.PAYLOAD_PUBLIC_BASE_DNS,
  rateLimit: {
    trustProxy: true,
  },
  admin: {
    user: Users.slug,
  },
  collections: [
    Users,
    Examples,
  ],
  typescript: {
    outputFile: path.resolve(__dirname, 'payload-types.ts')
  },
  plugins: [
    // Pass the plugin to Payload
    cloudStorage({
      collections: {
        // Enable cloud storage for Examples collection
        examples: {
          // Create the S3 adapter
          adapter: s3Adapter({
            config: {
              endpoint: process.env.MINIO_ENDPOINT,
              credentials: {
                accessKeyId: process.env.MINIO_ACCESS_KEY,
                secretAccessKey: process.env.MINIO_SECRET_KEY,
              },
              region: 'us-east-1',
              forcePathStyle: true,
            },
            bucket: 'uploads',
          }),
        },
      },
    }),
  ],
});
