import multer from "multer";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images/users");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "_" + file.originalname);
  },
});

// upload profile photo
const profilePhotoMulter = multer({ storage: storage }).single("photo");

export default profilePhotoMulter
