const multer = require('multer');
const path = require('path');

// Set storage engine for multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // Directory to store the files
        cb(null, 'uploads/');  
    },
    filename: function (req, file, cb) {
        // Save with unique timestamp + original extension
        cb(null, Date.now() + path.extname(file.originalname));  
    }
    
});

// File filter to ensure only images are uploaded
const fileFilter = (req, file, cb) => {
    const allowedFileTypes = /jpeg|jpg|png|gif/;
    const extname = allowedFileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedFileTypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb(new Error('Only images are allowed'));
    }
};

// Multer upload configuration with no file size limit in this case
const upload = multer({
    storage: storage,
    fileFilter: fileFilter
});

module.exports = upload;
