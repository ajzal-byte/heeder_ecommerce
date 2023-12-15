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


module.exports = {upload, userProfileUpload};

