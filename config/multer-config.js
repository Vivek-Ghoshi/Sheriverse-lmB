const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinaryConfig'); 

// Define storage strategy for Cloudinary
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req, file) => {
        return {
            folder: 'Sheriverse Courses', // Cloudinary folder name
            resource_type: file.mimetype.startsWith('video') ? 'video' : 'image',
            format: file.mimetype.startsWith('video') ? 'mp4' : 'png',
        };
    },
});

// Initialize multer with Cloudinary storage
const upload = multer({ storage: storage });

module.exports = upload;
