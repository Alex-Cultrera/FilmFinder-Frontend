import { S3Client } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";

// Single configuration setup
const config = {
    region: process.env.REACT_APP_AWS_REGION,
    accessKey: process.env.REACT_APP_AWS_ACCESS_KEY,
    secretKey: process.env.REACT_APP_AWS_SECRET_KEY,
    bucket: process.env.REACT_APP_S3_BUCKET
};

const s3Client = new S3Client({
    region: config.region,
    credentials: {
        accessKeyId: config.accessKey,
        secretAccessKey: config.secretKey
    }
});

export const validateFileType = (file) => {
    const allowedTypes = [
        'image/jpeg',
        'image/png',
        'image/gif',
        'image/webp'
    ];

    if (!allowedTypes.includes(file.type)) {
        throw new Error('Unsupported file type. Please upload a JPEG, PNG, GIF, or WebP image.');
    }

    const MAX_SIZE = 5 * 1024 * 1024; // 5MB
    if (file.size > MAX_SIZE) {
        throw new Error('File too large. Please upload an image smaller than 5MB.');
    }

    return true;
};

export const uploadPhoto = async (file, userId) => {
    const extension = file.name.split('.').pop();
    const filename = `user-${userId}-${Date.now()}.${extension}`;

    try {
        validateFileType(file);

        const params = {
            client: s3Client,
            params: {
                Bucket: config.bucket,
                Key: `profile-photos/${filename}`,
                Body: file,
                ContentType: file.type
            }
        };

        const upload = new Upload(params);
        await upload.done();
        
        const photoUrl = `https://${config.bucket}.s3.${config.region}.amazonaws.com/profile-photos/${filename}`;
        return photoUrl;
    } catch (error) {
        console.error('Upload failed:', error);
        throw error;
    }
};