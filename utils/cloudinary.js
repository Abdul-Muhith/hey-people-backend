import {v2 as cloudinary} from 'cloudinary';
// import cloudinary from 'cloudinary';

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
});

export const cloudinaryUploadImg = async (fileToUploads) => {

    console.log('fileToUploads -> before ', fileToUploads);

    return new Promise((resolve) => {

        console.log('fileToUploads -> after ', fileToUploads);

        cloudinary.uploader.upload(fileToUploads, (result) => {

        console.log('fileToUploads -> after after ', fileToUploads);

            resolve(
                {
                    url: result.secure_url,
                    asset_id: result.asset_id,
                    public_id: result.public_id,
                },
                { resource_type: 'auto' }
            );
        });
    });
};

// TODO: cloudinary Delete Images - class 2

// export const cloudinaryUploadingImg = async (req, res, next) => { };