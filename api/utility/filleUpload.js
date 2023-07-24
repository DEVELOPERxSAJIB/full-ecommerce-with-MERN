import multer from "multer";

// create storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/images/user");
  },

  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const uploadSingleFile = multer(storage).single("photo");

export default uploadSingleFile;
