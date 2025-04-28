require('dotenv').config();
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const multer = require('multer');
const sharp = require('sharp');
const path = require('path');

const { v4: uuidv4 } = require('uuid');

// Configure S3 Client
const s3 = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    }
});

// Multer config
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
    fileFilter: (req, file, cb) => {
        const ext = path.extname(file.originalname).toLowerCase();
        const allowed = ['.jpg', '.jpeg', '.png'];
        if (allowed.includes(ext)) cb(null, true);
        else cb(new Error('Only .jpg, .jpeg, .png files are allowed'), false);
    }
});

// Resize & upload to S3
const resizeAndUpload = async (file, folder = 'uploads') => {
    const ext = '.jpeg';
    const fileName = `${folder}/${uuidv4()}${ext}`;

    const buffer = await sharp(file.buffer)
        .resize({ width: 800 })
        .toFormat('jpeg')
        .jpeg({ quality: 80 })
        .toBuffer();

    const command = new PutObjectCommand({
        Bucket: process.env.AWS_S3_BUCKET,
        Key: fileName,
        Body: buffer,
        ContentType: 'image/jpeg'
    });

    const result = await s3.send(command);
    
    // Build URL
    const url = `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;
    return url;
};

module.exports = { upload, resizeAndUpload };