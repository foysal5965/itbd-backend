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
  
  const upload = multer({ storage: storage })
  const uploadToCloudinary = async (file: IFile): Promise<ICloudinaryResponse | undefined> => {
    return new Promise((resolve, reject) => {
        cloudinary.uploader.upload(file.path,
            (error: Error, result: ICloudinaryResponse) => {
                fs.unlinkSync(file.path)
                if (error) {
                    reject(error)
                }
                else {
                    resolve(result)
                }
            })
    })
};
  export const fileUploader ={
    upload,
    uploadToCloudinary
  }