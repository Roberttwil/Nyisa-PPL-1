const aws = require('aws-sdk');
const multer = require('multer');
const sharp = require('sharp');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

// Configure AWS S3
aws.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
});

const s3 = new aws.S3();

// Multer middleware using memory storage (buffered)
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 2 * 1024 * 1024 }, // 2MB max size
    fileFilter: (req, file, cb) => {
        const ext = path.extname(file.originalname).toLowerCase();
        const allowed = ['.jpg', '.jpeg', '.png'];
        if (allowed.includes(ext)) {
            cb(null, true);
        } else {
            cb(new Error('Only .jpg, .jpeg, .png files are allowed'), false);
        }
    },
});

const resizeAndUpload = async (file, folder = 'uploads') => {
    const ext = '.jpeg'; // JPEG for compression sir cuz of lossy yes
    const fileName = `${folder}/${uuidv4()}${ext}`;

    // Resize image to width 800px, maintain aspect ratio, compress
    const buffer = await sharp(file.buffer)
        .resize({ width: 800 })
        .toFormat('jpeg')
        .jpeg({ quality: 80 }) // compress quality
        .toBuffer();

    const uploadParams = {
        Bucket: process.env.AWS_S3_BUCKET,
        Key: fileName,
        Body: buffer,
        ACL: 'public-read',
        ContentType: 'image/jpeg',
    };

    const result = await s3.upload(uploadParams).promise();
    return result.Location;
};

module.exports = {
    upload,          // Use as middleware: upload.single('photo')
    resizeAndUpload, // Use after multer to upload to S3
};
