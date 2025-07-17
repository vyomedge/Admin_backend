const multer = require('multer');
const storage = multer.memoryStorage(); // Keep file in memory
const upload = multer({ storage });

module.exports = upload;
