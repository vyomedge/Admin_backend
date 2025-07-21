const multer = require('multer');
const { v2: cloudinary } = require('cloudinary');
const streamifier = require('streamifier');


cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Multer Memory Storage
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only JPG, PNG, and WEBP images are allowed'));
    }
  },
});

// Upload buffer to Cloudinary
const uploadToCloudinary = (buffer, folder = 'blogs') => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        transformation: [{ width: 1000, crop: 'limit' }],
      },
      (error, result) => {
        if (result) resolve(result);
        else reject(error);
      }
    );
    // console.log(streamifier.createReadStream(buffer).pipe(stream))
    streamifier.createReadStream(buffer).pipe(stream);
  });

};

module.exports = { upload, uploadToCloudinary };
