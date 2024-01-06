const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../public/uploads')); 
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });


const userProfile = multer.diskStorage({
  destination: (req, file, cb)=>{
    cb(null, path.join(__dirname, '../public/user_profile'));
  },
  filename: (req, file, cb)=>{
    cb(null,Date.now() + path.extname(file.originalname));
  }
});

const userProfileUpload = multer({storage: userProfile})


const bannerImage = multer.diskStorage({
  destination: (req, file, cb)=>{
    cb(null, path.join(__dirname, '../public/banner_uploads'));
  },
  filename: (req, file, cb)=>{
    cb(null,Date.now() + path.extname(file.originalname));
  }
});

const bannerUpload = multer({storage: bannerImage})


module.exports = {upload, userProfileUpload, bannerUpload};

