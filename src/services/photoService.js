import { S3Client } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";

const s3Client = new S3Client({
    region: process.env.REACT_APP_AWS_REGION,
    credentials: {
        accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY,
        secretAccessKey: process.env.REACT_APP_AWS_SECRET_KEY,
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
                Bucket: process.env.REACT_APP_S3_BUCKET,
                Key: `profile-photos/${filename}`,
                Body: file,
                ContentType: file.type
            }
        };

        const upload = new Upload(params);
        await upload.done();
        
        const photoUrl = `https://${process.env.REACT_APP_S3_BUCKET}.s3.${process.env.REACT_APP_AWS_REGION}.amazonaws.com/profile-photos/${filename}`;
        return photoUrl;
    } catch (error) {
        console.error('Upload failed:', error);
        throw error;
    }
};