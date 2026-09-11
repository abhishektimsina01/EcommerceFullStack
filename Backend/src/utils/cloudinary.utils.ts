import fs from "fs"
import { cloudinary } from "../config/cloudinary.config"

export const uploader = async (path : string) => {
    const cloud_data = await cloudinary.uploader.upload(path)

    fs.unlink(path, (err) => {
        if(err){throw err}
        console.log("file was ")
    })
    return cloud_data
}