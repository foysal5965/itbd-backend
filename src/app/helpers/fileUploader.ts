import multer from "multer"
import path from "path"
import { ICloudinaryResponse, IFile } from "../interfaces/file"
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs'
cloudinary.config({
  cloud_name: 'def4tyoba',
  api_key: '764148684859177',
  api_secret: 'qT5xDHzwRc9JoWtElV9pmsft0DU' // Click 'View API Keys' above to copy your API secret
});
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(process.cwd(), 'uploads'))
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})
const uploadSingleImage = multer({
  storage: storage
}).single('file');

const generateMulterFields = (numberOfQuestions:any) => {
  let fields = [];
  for (let i = 0; i < numberOfQuestions; i++) {
      fields.push({ name: `questionImages[${i}]`, maxCount: 1 });
  }
  return fields;
};

// Example usage
const numberOfQuestions = 1; // Set dynamically based on your form data
const upload = multer({
  storage: storage,
}).fields(generateMulterFields(numberOfQuestions));
// Update uploadToCloudinary to accept either a single file or an array of files
const updateUpload = multer({
  storage: storage,
}).any();
export const uploadToCloudinary = async (
  files: IFile | IFile[]
): Promise<ICloudinaryResponse | ICloudinaryResponse[] | undefined> => {
  const uploadSingleFile = (file: IFile): Promise<ICloudinaryResponse | undefined> => {
    return new Promise((resolve, reject) => {
      cloudinary.uploader.upload(file.path, (error: Error, result: ICloudinaryResponse) => {
        fs.unlinkSync(file.path); // Clean up the local file after uploading
        if (error) {
          reject(error);  // Reject the promise if there's an error
        } else {
          resolve(result);  // Resolve with the upload result
        }
      });
    });
  };

  // If files is an array, handle multiple uploads
  if (Array.isArray(files)) {
    const results = await Promise.all(files.map(uploadSingleFile));
    const validResults = results.filter((result): result is ICloudinaryResponse => result !== undefined); // Filter out undefined
    return validResults;
  }

  // Otherwise, handle a single file upload
  return uploadSingleFile(files);
};


export const fileUploader = {
  upload,
  uploadToCloudinary,
  uploadSingleImage,
  updateUpload
}