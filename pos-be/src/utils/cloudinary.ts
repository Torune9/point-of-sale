import { v2 as cloudinary } from "cloudinary";
import { logger } from "./logger.js";

const cloudName = process.env.CLOUDINARY_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_SECRET_KEY;

if (!cloudName || !apiKey || !apiSecret) {
  logger.error("Missing Cloudinary environment variables!");
  throw new Error("Missing Cloudinary environment variables!");
}

cloudinary.config({
  cloud_name: cloudName,
  api_key: apiKey,
  api_secret: apiSecret,
});

export const cloudinaryImageUpload = async (file: string, id: string) => {
  try {
    const result = await cloudinary.uploader.upload(file, {
      folder: "barcodes",
      public_id: id,        
      overwrite: true,      
      resource_type: "image",
    });

    logger.info(`Uploaded barcode for product ${id}`);
    return result.secure_url;

  } catch (error: any) {
    logger.error(`Failed to upload image for product ${id}: ${error.message}`);
    throw new Error(`Cloudinary upload failed: ${error.message}`);
  }
};


export const cloudinaryImageDestroy = async (id: string) => {
  try {
    const publicId = `barcodes/${id}`; 
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: "image",
    });

    if (result.result === "ok") {
      logger.info(`Old barcode deleted for product ${id}`);
    } else {
      logger.warn(`No existing barcode found for product ${id}`);
    }

  } catch (error: any) {
    logger.warn(`Failed to delete old barcode for product ${id}: ${error.message}`);
    throw new Error(`Cloudinary delete failed: ${error.message}`);
  }
};
