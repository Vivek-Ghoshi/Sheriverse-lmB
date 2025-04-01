const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinaryConfig'); 

// Define storage strategy for Cloudinary
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req, file) => {
        const isVideo = file.mimetype.startsWith('video');
        const isImage = file.mimetype.startsWith('image');
        return {
            folder: 'Sheriverse Courses', // Cloudinary folder name
            resource_type: isVideo ? 'video' : isImage ? 'image' : 'auto',
            format: isVideo || isImage ? undefined : 'auto',
        };
    },
});

// Initialize multer with Cloudinary storage
const upload = multer({ storage: storage });

module.exports = upload;
