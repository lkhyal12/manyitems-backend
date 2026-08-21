const express = require("express");
const cloudinary = require("cloudinary").v2;
const multer = require("multer");
const streamifier = require("streamifier");
const uploadRouter = express.Router();
const dotEnv = require("dotenv");
dotEnv.config();
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_Cloud_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// mumter setup
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (reqq, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else cb(new Error("Only image files are allowed"));
  },
});

uploadRouter.post("/", upload.single("image"), async (req, res) => {
  try {
    if (!req.file)
      return res.status(400).json({ message: "No file was found" });

    const streamUpload = (fileBuffer) => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream((error, result) => {
          if (result) resolve(result);
          else reject(error);
        });

        // use stremifier to convert file buffer into a stream
        streamifier.createReadStream(fileBuffer).pipe(stream);
      });
    };

    const result = await streamUpload(req.file.buffer);
    return res.status(200).json({
      message: "image stream created successfully",
      imageUrl: result.secure_url,
    });
  } catch (err) {
    console.log("err in the uoload controller in upload router ", err);
    return res.status(500).json({ message: "Server error" });
  }
});
module.exports = uploadRouter;
