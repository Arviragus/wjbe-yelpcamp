const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
      // cloud name set to our env cloudinarycloudname
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      // api key name set to our cloudinarykey
      api_key: process.env.CLOUDINARY_KEY,
      // secret set to our cloudinarysecret
      api_secret: process.env.CLOUDINARY_SECRET
});

const storage = new CloudinaryStorage({
      cloudinary,
      params: {
            folder: 'YelpCamp',
            allowedFormats: ['jpeg', 'jpg', 'png']
      }
})

module.exports = {
      cloudinary,
      storage
}
