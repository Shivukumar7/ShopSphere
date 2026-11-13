const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const cloudinary = require('../config/cloudinary');
const { protect, admin } = require('../middleware/auth');

router.post('/', protect, admin, upload.single('image'), async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No image file uploaded' });
    }

    // If Cloudinary is configured with valid credentials
    if (
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_KEY !== '123456789012345'
    ) {
      const b64 = Buffer.from(req.file.buffer).toString('base64');
      const dataURI = `data:${req.file.mimetype};base64,${b64}`;
      const result = await cloudinary.uploader.upload(dataURI, {
        folder: 'shopsphere/products',
      });
      return res.json({
        success: true,
        imageUrl: result.secure_url,
      });
    }

    // Fallback: encode buffer as data URI so it works 100% reliably in local test mode
    const b64 = Buffer.from(req.file.buffer).toString('base64');
    const dataURI = `data:${req.file.mimetype};base64,${b64}`;

    res.json({
      success: true,
      imageUrl: dataURI,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
