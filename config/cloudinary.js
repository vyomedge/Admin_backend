const multer = require('multer');
const { v2: cloudinary } = require('cloudinary');
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => ({
    folder: 'blogs',
    allowed_formats: ['jpg', 'jpeg', 'png'],
    public_id: `${Date.now()}-${file.originalname.split('.')[0]}`
  }),
});

const upload = multer({ storage });

module.exports = upload;
